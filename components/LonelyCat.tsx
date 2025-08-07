'use client'
import { useEffect, useRef } from 'react'
// @ts-expect-error - behavior3js lacks types
import * as b3 from 'behavior3js'

/**
 * Natural Interactive SVG Cat Game Component
 * 
 * This component implements a sophisticated interactive cat experience using:
 * - Dynamic SVG texture generation for lifelike animations
 * - Enhanced behavior trees for natural AI behaviors
 * - Matter.js physics for realistic movement
 * - Accessibility features for inclusive interaction
 * 
 * Features implemented:
 * - Click-to-move with anticipation animations
 * - Hover proximity detection and response
 * - Breathing, blinking, and tail sway animations
 * - Sleep mode after 30 seconds of inactivity
 * - Keyboard accessibility controls
 * - 60fps performance optimization
 */

// Type definitions for Phaser and behavior3js
interface Velocity {
  x: number
  y: number
}

interface MatterBody {
  velocity: Velocity
}

// Type guard to check if body has velocity property
function hasMatterPhysics(body: unknown): body is MatterBody {
  return body !== null && typeof body === 'object' && 'velocity' in body
}


interface PhaserGame {
  destroy: (removeCanvas: boolean, noReturn?: boolean) => void
  canvas: HTMLCanvasElement
}

export default function LonelyCat() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<PhaserGame | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return
    if (!containerRef.current || gameRef.current) return

    let game: PhaserGame
    const init = async () => {
      const Phaser = (await import('phaser')).default

      interface AnimationState {
        frame: number
        blinkTimer: number
        breathingPhase: number
        tailSwayPhase: number
        lastInteraction: number
        isMoving: boolean
        isSleeping: boolean
        eyeState: 'open' | 'closed'
        currentTexture: string
      }

      class CatScene extends Phaser.Scene {
        cat!: Phaser.Physics.Matter.Sprite
        tree!: b3.BehaviorTree
        blackboard = new b3.Blackboard()
        animationState: AnimationState = {
          frame: 0,
          blinkTimer: 0,
          breathingPhase: 0,
          tailSwayPhase: 0,
          lastInteraction: Date.now(),
          isMoving: false,
          isSleeping: false,
          eyeState: 'open' as 'open' | 'closed',
          currentTexture: 'idle'
        }
        preload() {
          this.load.spritesheet('cat', '/cat-sprites.png', {
            frameWidth: 600,
            frameHeight: 600
          });
        }

        create() {
          this.matter.world.setBounds()
          
          // Check if texture exists before creating sprite
          if (!this.textures.exists('cat')) {
            console.error('Cat texture not found')
            return
          }

          // Create cat sprite from sprite sheet
          const centerX = this.cameras.main.width / 2
          const centerY = this.cameras.main.height / 2
          this.cat = this.matter.add.sprite(centerX, centerY, 'cat')
            .setFixedRotation()
            .setDisplaySize(300, 300);

          // Define tail wag animation with error handling
          try {
            if (this.anims.exists('tail')) {
              this.anims.remove('tail')
            }
            
            this.anims.create({
              key: 'tail',
              frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 8 }),
              frameRate: 8,
              repeat: -1
            });
            
            if (this.cat && this.anims.exists('tail')) {
              this.cat.play('tail');
              // Ensure display size remains at 300x300 after animation starts
              this.cat.setDisplaySize(300, 300);
            }
          } catch (error) {
            console.error('Failed to create or play animation:', error)
          }

          // Set physics body to match visual size
          this.cat.setBody({
            type: 'rectangle',
            width: 120,
            height: 160
          } as any)

          // Set up physics for natural movement
          this.cat.setFriction(0.8)
          this.cat.setFrictionAir(0.05)
          this.cat.setBounce(0.1)

          // Set up world bounds with margin for cat sprite (200x240 from SVG)
          const catMargin = 120 // Half of cat width/height plus buffer
          this.matter.world.setBounds(
            -catMargin,
            -catMargin,
            this.cameras.main.width + catMargin * 2,
            this.cameras.main.height + catMargin * 2
          )

          // Create enhanced behavior tree
          this.setupEnhancedBehaviorTree()

          // Set up input handlers
          this.setupInputHandlers()

          // Set up accessibility
          this.setupAccessibility()
        }

        setupEnhancedBehaviorTree() {
          // Enhanced MoveToTarget behavior
          const EnhancedMoveToTarget = class extends b3.Action {
            tick(tick: b3.Tick<CatScene>) {
              const scene = tick.target as CatScene
              const target = scene.blackboard.get('target', scene.tree.id)
              if (!target) return b3.FAILURE

              const cat = scene.cat
              const dx = target.x - cat.x
              const dy = target.y - cat.y
              const dist = Math.hypot(dx, dy)

              // Add anticipation animation before movement
              if (!scene.blackboard.get('anticipationStarted', scene.tree.id)) {
                scene.showAnticipationAnimation()
                scene.blackboard.set('anticipationStarted', true, scene.tree.id)
                return b3.RUNNING
              }

              if (dist < 10) {
                cat.setVelocity(0, 0)
                scene.blackboard.set('target', null, scene.tree.id)
                scene.blackboard.set('anticipationStarted', false, scene.tree.id)
                scene.animationState.lastInteraction = Date.now()
                return b3.SUCCESS
              }

              // Natural acceleration/deceleration
              const maxSpeed = 3
              const acceleration = 0.1
              const currentSpeed = hasMatterPhysics(cat.body)
                ? Math.hypot(cat.body.velocity.x, cat.body.velocity.y)
                : 0
              const targetSpeed = Math.min(maxSpeed, dist * 0.05)

              const newSpeed = Math.min(currentSpeed + acceleration, targetSpeed)
              cat.setVelocity((dx / dist) * newSpeed, (dy / dist) * newSpeed)

              return b3.RUNNING
            }
          }

          // Sleep mode behavior
          const SleepMode = class extends b3.Action {
            tick(tick: b3.Tick<CatScene>) {
              const scene = tick.target as CatScene
              const timeSinceLastInteraction = Date.now() - scene.animationState.lastInteraction

              if (timeSinceLastInteraction > 30000) { // 30 seconds
                scene.animationState.isSleeping = true
                scene.cat.setVelocity(0, 0)
                return b3.SUCCESS
              }

              return b3.FAILURE
            }
          }

          // Enhanced Wander behavior with gentle boundary attraction
          const EnhancedWander = class extends b3.Action {
            tick(tick: b3.Tick<CatScene>) {
              const scene = tick.target as CatScene
              const cat = scene.cat

              if (scene.animationState.isSleeping) return b3.FAILURE

              // Gentle attraction toward center if cat gets too far out
              const centerX = scene.cameras.main.width / 2
              const centerY = scene.cameras.main.height / 2
              const distanceFromCenter = Math.hypot(cat.x - centerX, cat.y - centerY)
              const maxDistance = Math.min(scene.cameras.main.width, scene.cameras.main.height) * 0.4

              if (distanceFromCenter > maxDistance && Math.random() < 0.02) {
                const angleToCenter = Math.atan2(centerY - cat.y, centerX - cat.x)
                const speed = 0.3 + Math.random() * 0.3
                cat.setVelocity(Math.cos(angleToCenter) * speed, Math.sin(angleToCenter) * speed)
                return b3.RUNNING
              }

              if (Math.random() < 0.005) {
                const angle = Math.random() * Math.PI * 2
                const speed = 0.5 + Math.random() * 0.5
                cat.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
              }
              return b3.RUNNING
            }
          }

          // Proximity response behavior
          const ProximityResponse = class extends b3.Action {
            tick(tick: b3.Tick<CatScene>) {
              const scene = tick.target as CatScene
              const userProximity = scene.blackboard.get('userProximity', scene.tree.id)

              if (userProximity) {
                scene.animationState.lastInteraction = Date.now()
                scene.animationState.isSleeping = false
                // Increase blink rate when user is close
                if (Math.random() < 0.02) {
                  scene.triggerBlinkAnimation()
                }
                return b3.SUCCESS
              }

              return b3.FAILURE
            }
          }

          this.tree = new b3.BehaviorTree()
          this.tree.root = new b3.Priority({
            children: [
              new EnhancedMoveToTarget(),
              new ProximityResponse(),
              new SleepMode(),
              new EnhancedWander()
            ]
          })
        }

        setupInputHandlers() {
          // Enhanced click handler with visual feedback
          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.blackboard.set('target', { x: pointer.worldX, y: pointer.worldY }, this.tree.id)
            this.animationState.lastInteraction = Date.now()
            this.animationState.isSleeping = false

            // Add click feedback animation
            this.showClickFeedback(pointer.worldX, pointer.worldY)

            // Cat looks toward target immediately
            this.showTargetAttention(pointer.worldX, pointer.worldY)
          })

          // Hover detection
          this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            const distance = Phaser.Math.Distance.Between(
              pointer.worldX, pointer.worldY, this.cat.x, this.cat.y
            )

            if (distance < 100) {
              this.blackboard.set('userProximity', true, this.tree.id)
              this.blackboard.set('cursorPosition', { x: pointer.worldX, y: pointer.worldY }, this.tree.id)
            } else {
              this.blackboard.set('userProximity', false, this.tree.id)
            }
          })
        }

        setupAccessibility() {
          // Will be enhanced when canvas is available
          this.time.delayedCall(100, () => {
            const canvas = this.game.canvas
            if (canvas) {
              canvas.setAttribute('aria-label', 'Interactive cat game - click to guide cat movement, hover for attention')
              canvas.setAttribute('role', 'application')
              canvas.setAttribute('tabindex', '0')

              // Keyboard controls
              canvas.addEventListener('keydown', (event) => {
                switch (event.key) {
                  case ' ':
                    this.triggerRandomBehavior()
                    break
                  case 'ArrowUp':
                    this.blackboard.set('target', { x: this.cat.x, y: this.cat.y - 100 }, this.tree.id)
                    break
                  case 'ArrowDown':
                    this.blackboard.set('target', { x: this.cat.x, y: this.cat.y + 100 }, this.tree.id)
                    break
                  case 'ArrowLeft':
                    this.blackboard.set('target', { x: this.cat.x - 100, y: this.cat.y }, this.tree.id)
                    break
                  case 'ArrowRight':
                    this.blackboard.set('target', { x: this.cat.x + 100, y: this.cat.y }, this.tree.id)
                    break
                }
              })
            }
          })
        }

        showAnticipationAnimation() {
          // Subtle crouch before movement
          this.tweens.add({
            targets: this.cat,
            scaleY: 0.9,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
          })
        }

        showClickFeedback(x: number, y: number) {
          // Create ripple effect at click location
          const ripple = this.add.circle(x, y, 30, 0x7FFF00, 0.6)
            .setScale(0.2);

          this.tweens.add({
            targets: ripple,
            scale: 1,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => ripple.destroy()
          });
        }

        showTargetAttention(targetX: number, targetY: number) {
          // Cat ears perk up and look toward target
          const angle = Math.atan2(targetY - this.cat.y, targetX - this.cat.x)

          this.tweens.add({
            targets: this.cat,
            rotation: angle * 0.1, // Subtle rotation toward target
            duration: 300,
            ease: 'Power2',
            yoyo: true
          })
        }

        triggerBlinkAnimation() {
          this.animationState.eyeState = 'closed'
          this.time.delayedCall(150, () => {
            this.animationState.eyeState = 'open'
          })
        }

        triggerRandomBehavior() {
          const behaviors = [
            () => this.triggerBlinkAnimation(),
            () => {
              const angle = Math.random() * Math.PI * 2
              this.blackboard.set('target', {
                x: this.cat.x + Math.cos(angle) * 50,
                y: this.cat.y + Math.sin(angle) * 50
              }, this.tree.id)
            }
          ]

          const randomBehavior = behaviors[Math.floor(Math.random() * behaviors.length)]
          randomBehavior()
        }

        update(_time: number, delta: number) {
          // Update animation frame
          this.animationState.frame += 1

          // Ensure cat sprite stays at correct display size
          if (this.cat && (this.cat.displayWidth !== 300 || this.cat.displayHeight !== 300)) {
            this.cat.setDisplaySize(300, 300)
          }

          // Update natural animations
          this.updateNaturalAnimations(_time, delta)

          // Run behavior tree only if it's initialized
          if (this.tree) {
            this.tree.tick(this, this.blackboard)
          }
        }

        updateNaturalAnimations(_time: number, delta: number) {
          // Blinking timer
          this.animationState.blinkTimer += delta
          if (this.animationState.blinkTimer > 3000 + Math.random() * 2000) {
            if (!this.animationState.isSleeping) {
              this.triggerBlinkAnimation()
            }
            this.animationState.blinkTimer = 0
          }
          
          // Micro-movements for realism
          if (!this.animationState.isSleeping && Math.random() < 0.01) {
            this.triggerMicroMovements()
          }
          
          // Random ear twitching
          if (Math.random() < 0.005) {
            this.triggerEarTwitch()
          }
          
          // Subtle body shifting
          if (Math.random() < 0.003) {
            this.triggerBodyShift()
          }
        }
        
        triggerMicroMovements() {
          // Subtle head movement
          this.tweens.add({
            targets: this.cat,
            rotation: (Math.random() - 0.5) * 0.1,
            duration: 800 + Math.random() * 400,
            ease: 'Power2.easeInOut',
            yoyo: true
          })
        }
        
        triggerEarTwitch() {
          // Prevent overlapping ear twitches that could cause scale accumulation
          if (this.tweens.getTweensOf(this.cat).some(tween => tween.data && tween.data.some((d: any) => d.key === 'scaleX'))) {
            return
          }
          
          // Simulate ear twitching through subtle scale changes
          this.tweens.add({
            targets: this.cat,
            scaleX: 1 + (Math.random() - 0.5) * 0.02,
            duration: 300,
            ease: 'Power2.easeInOut',
            yoyo: true,
            onComplete: () => {
              // Ensure scale returns to exactly 1.0
              this.cat.setScale(1.0, 1.0)
            }
          })
        }
        
        triggerBodyShift() {
          // Subtle body position shift
          const currentX = this.cat.x
          const currentY = this.cat.y
          
          this.tweens.add({
            targets: this.cat,
            x: currentX + (Math.random() - 0.5) * 6,
            y: currentY + (Math.random() - 0.5) * 4,
            duration: 1500 + Math.random() * 1000,
            ease: 'Power2.easeInOut'
          })
        }
      }

      const scene = new CatScene('play')

      const config = {
        type: Phaser.CANVAS,
        width: containerRef.current!.clientWidth,
        height: containerRef.current!.clientHeight,
        physics: {
          default: 'matter',
          matter: { gravity: { x: 0, y: 0 } }
        },
        scene,
        parent: containerRef.current
      }

      game = new Phaser.Game(config)
      gameRef.current = game
    }

    init().catch(console.error)

    return () => {
      game?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} data-testid="cat-game" className="w-full h-full" />
}