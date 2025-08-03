'use client'
import { useEffect, useRef } from 'react'
// @ts-ignore - behavior3js lacks types
import * as b3 from 'behavior3js'

export default function CatGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<any>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return
    if (!containerRef.current || gameRef.current) return

    let game: any
    const init = async () => {
      const Phaser = (await import('phaser')).default

      class CatScene extends Phaser.Scene {
        cat!: Phaser.Physics.Matter.Sprite
        tree!: b3.BehaviorTree
        blackboard = new b3.Blackboard()

        preload() {
          this.load.spritesheet('cat', '/cat-sprites.png', {
            frameWidth: 200,
            frameHeight: 240
          })
        }

        create() {
          this.matter.world.setBounds()
          this.cat = this.matter.add.sprite(400, 300, 'cat')
          this.cat.setFixedRotation()
          this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 8 }),
            frameRate: 5,
            repeat: -1
          })
          this.cat.play('idle')

          const MoveToTarget = class extends b3.Action {
            tick(tick: b3.Tick<any>) {
              const scene = tick.target as CatScene
              const target = scene.blackboard.get('target', scene.tree.id)
              if (!target) return b3.FAILURE
              const cat = scene.cat
              const dx = target.x - cat.x
              const dy = target.y - cat.y
              const dist = Math.hypot(dx, dy)
              if (dist < 10) {
                cat.setVelocity(0, 0)
                scene.blackboard.set('target', null, scene.tree.id)
                return b3.SUCCESS
              }
              const speed = 2
              cat.setVelocity((dx / dist) * speed, (dy / dist) * speed)
              return b3.RUNNING
            }
          }

          const Wander = class extends b3.Action {
            tick(tick: b3.Tick<any>) {
              const scene = tick.target as CatScene
              const cat = scene.cat
              if (Math.random() < 0.02) {
                const angle = Math.random() * Math.PI * 2
                cat.setVelocity(Math.cos(angle), Math.sin(angle))
              }
              return b3.RUNNING
            }
          }

          this.tree = new b3.BehaviorTree()
          this.tree.root = new b3.Priority({
            children: [new MoveToTarget(), new Wander()]
          })

          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.blackboard.set('target', { x: pointer.worldX, y: pointer.worldY }, this.tree.id)
          })
        }

        update() {
          this.tree.tick(this, this.blackboard)
        }
      }

      const scene = new CatScene('play')

      const config: any = {
        type: Phaser.CANVAS,
        width: containerRef.current!.clientWidth,
        height: containerRef.current!.clientHeight,
        physics: {
          default: 'matter',
          matter: { gravity: { y: 0 } }
        },
        scene,
        parent: containerRef.current
      }

      game = new Phaser.Game(config)
      gameRef.current = game
    }

    init()

    return () => {
      game?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} data-testid="cat-game" className="w-full h-full" />
}
