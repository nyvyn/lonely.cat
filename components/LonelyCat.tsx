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
interface PhaserScene {
  textures: {
    addCanvas: (key: string, canvas: HTMLCanvasElement) => void
    exists: (key: string) => boolean
  }
}

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

/**
 * SVG Texture Manager - Generates dynamic cat textures for different states
 * 
 * This class creates SVG-based textures for:
 * - Idle states with breathing and blinking
 * - Movement states with directional lean and leg motion
 * - Sleep state with curled position and Z symbols
 * 
 * Features:
 * - Texture caching for performance
 * - Dynamic animation based on game state
 * - Realistic cat anatomy with fur patterns
 */
class SVGTextureManager {
  private scene: PhaserScene
  private textureCache = new Map<string, string>()
  private createdTextures = new Set<string>()

  constructor(scene: PhaserScene) {
    this.scene = scene
  }

  generateIdleTexture(frame: number, eyeState = 'open'): string {
    const cacheKey = `idle-${frame}-${eyeState}`
    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!
    }

    const breathingScale = 1 + Math.sin(frame * 0.05) * 0.02
    const tailSway = Math.sin(frame * 0.02) * 8
    const eyeHeight = eyeState === 'closed' ? 2 : 8 + Math.sin(frame * 0.03)

    const svg = `<svg width="200" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bodyGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stop-color="#F4E4BC"/>
          <stop offset="100%" stop-color="#D2B48C"/>
        </radialGradient>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M 0,4 L 4,0 M -1,1 L 1,-1 M 3,5 L 5,3" stroke="#CD853F" stroke-width="0.5"/>
        </pattern>
      </defs>
      
      <!-- Shadow -->
      <ellipse cx="100" cy="220" rx="60" ry="15" fill="rgba(0,0,0,0.2)"/>
      
      <!-- Tail -->
      <g transform="translate(150,200) rotate(${tailSway})">
        <path d="M0,0 Q20,-20 15,-40 Q10,-60 20,-80" 
              stroke="url(#bodyGradient)" stroke-width="14" stroke-linecap="round"/>
        <path d="M0,0 Q20,-20 15,-40 Q10,-60 20,-80" 
              stroke="url(#stripes)" stroke-width="12" stroke-linecap="round"/>
      </g>
      
      <!-- Back legs -->
      <ellipse cx="85" cy="200" rx="8" ry="25" fill="url(#bodyGradient)"/>
      <ellipse cx="115" cy="200" rx="8" ry="25" fill="url(#bodyGradient)"/>
      <circle cx="85" cy="218" r="6" fill="#8B4513"/>
      <circle cx="115" cy="218" r="6" fill="#8B4513"/>
      
      <!-- Body -->
      <ellipse cx="100" cy="160" rx="${50 * breathingScale}" ry="${40 * breathingScale}" 
               fill="url(#bodyGradient)" transform="scale(${breathingScale})"/>
      <ellipse cx="100" cy="160" rx="${45 * breathingScale}" ry="${35 * breathingScale}" 
               fill="url(#stripes)" opacity="0.6" transform="scale(${breathingScale})"/>
      
      <!-- Front legs -->
      <ellipse cx="80" cy="185" rx="7" ry="20" fill="url(#bodyGradient)"/>
      <ellipse cx="120" cy="185" rx="7" ry="20" fill="url(#bodyGradient)"/>
      <circle cx="80" cy="200" r="5" fill="#8B4513"/>
      <circle cx="120" cy="200" r="5" fill="#8B4513"/>
      
      <!-- Neck -->
      <ellipse cx="100" cy="125" rx="25" ry="20" fill="url(#bodyGradient)"/>
      
      <!-- Head -->
      <circle cx="100" cy="100" r="35" fill="url(#bodyGradient)"/>
      <circle cx="100" cy="100" r="30" fill="url(#stripes)" opacity="0.4"/>
      
      <!-- Ears -->
      <g id="ears">
        <path d="M75,75 L85,55 L95,75" fill="url(#bodyGradient)"/>
        <path d="M105,75 L115,55 L125,75" fill="url(#bodyGradient)"/>
        <path d="M78,70 L85,60 L92,70" fill="#FFB6C1"/>
        <path d="M108,70 L115,60 L122,70" fill="#FFB6C1"/>
      </g>
      
      <!-- Eyes -->
      <g id="eyes">
        <ellipse cx="88" cy="95" rx="8" ry="${eyeHeight}" fill="#32CD32"/>
        <ellipse cx="112" cy="95" rx="8" ry="${eyeHeight}" fill="#32CD32"/>
        <ellipse cx="88" cy="95" rx="4" ry="${Math.max(1, eyeHeight - 2)}" fill="#000"/>
        <ellipse cx="112" cy="95" rx="4" ry="${Math.max(1, eyeHeight - 2)}" fill="#000"/>
        <ellipse cx="90" cy="93" rx="1" ry="${Math.max(0.5, eyeHeight - 5)}" fill="#FFF"/>
        <ellipse cx="114" cy="93" rx="1" ry="${Math.max(0.5, eyeHeight - 5)}" fill="#FFF"/>
      </g>
      
      <!-- Nose -->
      <path d="M97,105 L100,108 L103,105 Z" fill="#FF69B4"/>
      
      <!-- Mouth -->
      <path d="M100,108 Q95,112 90,110" stroke="#8B4513" stroke-width="1.5"/>
      <path d="M100,108 Q105,112 110,110" stroke="#8B4513" stroke-width="1.5"/>
      
      <!-- Whiskers -->
      <g stroke="#8B4513" stroke-width="1">
        <path d="M70,100 L55,98"/>
        <path d="M70,105 L55,105"/>
        <path d="M70,110 L55,112"/>
        <path d="M130,100 L145,98"/>
        <path d="M130,105 L145,105"/>
        <path d="M130,110 L145,112"/>
      </g>
      
      <!-- Chest marking -->
      <ellipse cx="100" cy="145" rx="12" ry="8" fill="#FFF" opacity="0.8"/>
    </svg>`

    this.textureCache.set(cacheKey, svg)
    return svg
  }

  generateMovingTexture(velocity: Velocity, frame: number): string {
    const speed = Math.hypot(velocity.x, velocity.y)
    const direction = Math.atan2(velocity.y, velocity.x)
    const cacheKey = `moving-${Math.round(direction * 10)}-${Math.round(speed * 10)}-${frame}`
    
    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!
    }

    // Lean body in movement direction
    const bodyLean = Math.min(speed * 5, 15)
    const legCycle = Math.sin(frame * 0.3) * 5
    const tailTrail = -direction * 20 + Math.sin(frame * 0.2) * 10

    const svg = `<svg width="200" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bodyGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stop-color="#F4E4BC"/>
          <stop offset="100%" stop-color="#D2B48C"/>
        </radialGradient>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M 0,4 L 4,0 M -1,1 L 1,-1 M 3,5 L 5,3" stroke="#CD853F" stroke-width="0.5"/>
        </pattern>
      </defs>
      
      <g transform="translate(100,120) rotate(${bodyLean * Math.cos(direction)}) translate(-100,-120)">
        <!-- Shadow -->
        <ellipse cx="100" cy="220" rx="60" ry="15" fill="rgba(0,0,0,0.2)"/>
        
        <!-- Tail -->
        <g transform="translate(150,200) rotate(${tailTrail})">
          <path d="M0,0 Q20,-20 15,-40 Q10,-60 20,-80" 
                stroke="url(#bodyGradient)" stroke-width="14" stroke-linecap="round"/>
        </g>
        
        <!-- Body -->
        <ellipse cx="100" cy="160" rx="50" ry="40" fill="url(#bodyGradient)"/>
        <ellipse cx="100" cy="160" rx="45" ry="35" fill="url(#stripes)" opacity="0.6"/>
        
        <!-- Legs with running motion -->
        <ellipse cx="${85 + legCycle}" cy="200" rx="8" ry="25" fill="url(#bodyGradient)"/>
        <ellipse cx="${115 - legCycle}" cy="200" rx="8" ry="25" fill="url(#bodyGradient)"/>
        <ellipse cx="${80 - legCycle}" cy="185" rx="7" ry="20" fill="url(#bodyGradient)"/>
        <ellipse cx="${120 + legCycle}" cy="185" rx="7" ry="20" fill="url(#bodyGradient)"/>
        
        <!-- Head -->
        <ellipse cx="100" cy="125" rx="25" ry="20" fill="url(#bodyGradient)"/>
        <circle cx="100" cy="100" r="35" fill="url(#bodyGradient)"/>
        
        <!-- Ears -->
        <path d="M75,75 L85,55 L95,75" fill="url(#bodyGradient)"/>
        <path d="M105,75 L115,55 L125,75" fill="url(#bodyGradient)"/>
        
        <!-- Eyes -->
        <ellipse cx="88" cy="95" rx="8" ry="6" fill="#32CD32"/>
        <ellipse cx="112" cy="95" rx="8" ry="6" fill="#32CD32"/>
        <ellipse cx="88" cy="95" rx="4" ry="3" fill="#000"/>
        <ellipse cx="112" cy="95" rx="4" ry="3" fill="#000"/>
        
        <!-- Nose and mouth -->
        <path d="M97,105 L100,108 L103,105 Z" fill="#FF69B4"/>
        <path d="M100,108 Q95,112 90,110" stroke="#8B4513" stroke-width="1.5"/>
        <path d="M100,108 Q105,112 110,110" stroke="#8B4513" stroke-width="1.5"/>
        
        <!-- Whiskers blowing back -->
        <g stroke="#8B4513" stroke-width="1">
          <path d="M70,100 L${55 - speed * 3},${98 - speed}"/>
          <path d="M70,105 L${55 - speed * 3},105"/>
          <path d="M70,110 L${55 - speed * 3},${112 + speed}"/>
          <path d="M130,100 L${145 + speed * 3},${98 - speed}"/>
          <path d="M130,105 L${145 + speed * 3},105"/>
          <path d="M130,110 L${145 + speed * 3},${112 + speed}"/>
        </g>
      </g>
    </svg>`

    this.textureCache.set(cacheKey, svg)
    return svg
  }

  generateSleepingTexture(frame: number): string {
    const cacheKey = `sleeping-${frame}`
    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!
    }

    const breathingScale = 1 + Math.sin(frame * 0.02) * 0.03
    
    const svg = `<svg width="200" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bodyGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stop-color="#F4E4BC"/>
          <stop offset="100%" stop-color="#D2B48C"/>
        </radialGradient>
      </defs>
      
      <!-- Shadow -->
      <ellipse cx="100" cy="220" rx="80" ry="20" fill="rgba(0,0,0,0.3)"/>
      
      <!-- Curled up body -->
      <ellipse cx="100" cy="180" rx="${60 * breathingScale}" ry="${45 * breathingScale}" 
               fill="url(#bodyGradient)" transform="scale(${breathingScale})"/>
      
      <!-- Head tucked in -->
      <circle cx="100" cy="150" r="30" fill="url(#bodyGradient)"/>
      
      <!-- Closed eyes -->
      <path d="M85,145 Q90,142 95,145" stroke="#000" stroke-width="2"/>
      <path d="M105,145 Q110,142 115,145" stroke="#000" stroke-width="2"/>
      
      <!-- Nose -->
      <circle cx="100" cy="155" r="2" fill="#FF69B4"/>
      
      <!-- Tail wrapped around -->
      <path d="M140,200 Q160,180 150,160 Q140,140 120,150 Q100,160 90,170" 
            stroke="url(#bodyGradient)" stroke-width="16" stroke-linecap="round"/>
      
      <!-- ZZZ sleep symbols -->
      <g opacity="0.7">
        <text x="140" y="120" font-family="Arial" font-size="16" font-weight="bold" fill="#87CEEB">Z</text>
        <text x="150" y="100" font-family="Arial" font-size="20" font-weight="bold" fill="#87CEEB">Z</text>
        <text x="160" y="80" font-family="Arial" font-size="24" font-weight="bold" fill="#87CEEB">Z</text>
      </g>
    </svg>`

    this.textureCache.set(cacheKey, svg)
    return svg
  }

  createTextureFromSVG(key: string, svgContent: string) {
    // Check if we've already created this texture
    if (this.createdTextures.has(key)) {
      return Promise.resolve()
    }
    
    // Mark as being created to prevent duplicates
    this.createdTextures.add(key)
    
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 240
    const ctx = canvas.getContext('2d')!
    
    const img = new Image()
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    
    return new Promise<void>((resolve) => {
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0)
          // Only add if not already exists in Phaser
          if (!this.scene.textures.exists(key)) {
            this.scene.textures.addCanvas(key, canvas)
          }
        } catch (error) {
          console.warn(`Failed to create texture ${key}:`, error)
        }
        URL.revokeObjectURL(url)
        resolve()
      }
      img.src = url
    })
  }


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
        svgTextureManager!: SVGTextureManager
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



        async create() {
          this.matter.world.setBounds()
          
          // Initialize SVG texture manager
          this.svgTextureManager = new SVGTextureManager(this)
          
          // Create initial cat sprite with fallback texture
          this.cat = this.matter.add.sprite(400, 300, 'cat')
          this.cat.setFixedRotation()
          
          // Set up physics for natural movement
          this.cat.setFriction(0.8)
          this.cat.setFrictionAir(0.05)
          this.cat.setBounce(0.1)
          
          // Generate initial SVG texture
          await this.updateCatTexture()
          
          // Create enhanced behavior tree
          this.setupEnhancedBehaviorTree()
          
          // Set up input handlers
          this.setupInputHandlers()
          
          // Set up accessibility
          this.setupAccessibility()
        }

        async updateCatTexture() {
          const velocity: Velocity = hasMatterPhysics(this.cat.body) 
            ? { x: this.cat.body.velocity.x, y: this.cat.body.velocity.y } 
            : { x: 0, y: 0 }
          const speed = Math.hypot(velocity.x, velocity.y)
          
          let svgContent: string
          let textureKey: string
          
          if (this.animationState.isSleeping) {
            svgContent = this.svgTextureManager.generateSleepingTexture(this.animationState.frame)
            textureKey = `cat-sleeping-${this.animationState.frame % 60}`
          } else if (speed > 0.5) {
            svgContent = this.svgTextureManager.generateMovingTexture(velocity, this.animationState.frame)
            textureKey = `cat-moving-${this.animationState.frame % 60}`
            this.animationState.isMoving = true
          } else {
            svgContent = this.svgTextureManager.generateIdleTexture(this.animationState.frame, this.animationState.eyeState)
            textureKey = `cat-idle-${this.animationState.frame % 60}-${this.animationState.eyeState}`
            this.animationState.isMoving = false
          }
          
          if (this.animationState.currentTexture !== textureKey) {
            await this.svgTextureManager.createTextureFromSVG(textureKey, svgContent)
            this.cat.setTexture(textureKey)
            this.animationState.currentTexture = textureKey
          }
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

          // Enhanced Wander behavior
          const EnhancedWander = class extends b3.Action {
            tick(tick: b3.Tick<CatScene>) {
              const scene = tick.target as CatScene
              const cat = scene.cat
              
              if (scene.animationState.isSleeping) return b3.FAILURE
              
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
          // Enhanced click handler
          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.blackboard.set('target', { x: pointer.worldX, y: pointer.worldY }, this.tree.id)
            this.animationState.lastInteraction = Date.now()
            this.animationState.isSleeping = false
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
          
          // Update natural animations
          this.updateNaturalAnimations(_time, delta)
          
          // Run behavior tree only if it's initialized
          if (this.tree) {
            this.tree.tick(this, this.blackboard)
          }
          
          // Update SVG texture every few frames for performance
          if (this.animationState.frame % 3 === 0) {
            this.updateCatTexture()
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