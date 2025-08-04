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

    const breathingScale = 1 + Math.sin(frame * 0.05) * 0.015
    const tailSway = Math.sin(frame * 0.02) * 12
    const eyeHeight = eyeState === 'closed' ? 2 : 9 + Math.sin(frame * 0.03) * 0.5
    const pupilHeight = eyeState === 'closed' ? 0.5 : Math.max(2, eyeHeight - 4)

    const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Enhanced body gradients for realistic fur with depth -->
        <linearGradient id="bodyGradient" x1="30%" y1="20%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F8F0E3"/>
          <stop offset="25%" stop-color="#F5E6D3"/>
          <stop offset="50%" stop-color="#E8D4B7"/>
          <stop offset="75%" stop-color="#D2B48C"/>
          <stop offset="100%" stop-color="#B39B7A"/>
        </linearGradient>
        
        <!-- Enhanced realistic fur texture pattern with directional flow -->
        <pattern id="furPattern" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(25)">
          <!-- Base fur strands -->
          <path d="M2,0 Q4,6 2,12 M6,0 Q8,6 6,12 M10,0 Q12,6 10,12" stroke="#E8D4B7" stroke-width="0.8" opacity="0.7"/>
          <path d="M0,2 Q6,4 12,2 M0,6 Q6,8 12,6 M0,10 Q6,12 12,10" stroke="#D2B48C" stroke-width="0.6" opacity="0.5"/>
          <!-- Fur depth highlights -->
          <circle cx="3" cy="3" r="1" fill="#F5E6D3" opacity="0.8"/>
          <circle cx="9" cy="7" r="0.8" fill="#F5E6D3" opacity="0.6"/>
          <circle cx="5" cy="9" r="0.6" fill="#E8D4B7" opacity="0.4"/>
          <!-- Shadow between fur -->
          <ellipse cx="6" cy="6" rx="2" ry="1" fill="#C19A6B" opacity="0.3"/>
        </pattern>
        
        <!-- Deeper fur pattern for layering -->
        <pattern id="deepFurPattern" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(35)">
          <path d="M0,4 Q8,0 16,4 Q8,8 0,4" fill="#C19A6B" opacity="0.3"/>
          <path d="M0,12 Q8,8 16,12 Q8,16 0,12" fill="#A0824B" opacity="0.2"/>
        </pattern>
        
        <!-- Tabby stripes pattern -->
        <pattern id="tabbyStripes" patternUnits="userSpaceOnUse" width="12" height="8" patternTransform="rotate(25)">
          <path d="M0,2 Q6,0 12,2 M0,6 Q6,4 12,6" stroke="#A0824B" stroke-width="1.2" opacity="0.7"/>
          <path d="M2,0 Q8,2 10,8 M6,0 Q10,4 12,8" stroke="#8B6914" stroke-width="0.8" opacity="0.5"/>
        </pattern>
        
        <!-- Realistic eye gradient -->
        <radialGradient id="eyeGradient" cx="30%" cy="25%">
          <stop offset="0%" stop-color="#7FFF00"/>
          <stop offset="40%" stop-color="#32CD32"/>
          <stop offset="80%" stop-color="#228B22"/>
          <stop offset="100%" stop-color="#006400"/>
        </radialGradient>
        
        <!-- Pupil with depth -->
        <radialGradient id="pupilGradient" cx="30%" cy="30%">
          <stop offset="0%" stop-color="#000"/>
          <stop offset="100%" stop-color="#333"/>
        </radialGradient>
        
        <!-- Nose gradient -->
        <linearGradient id="noseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFB6C1"/>
          <stop offset="50%" stop-color="#FF69B4"/>
          <stop offset="100%" stop-color="#CD5C5C"/>
        </linearGradient>
        
        <!-- Enhanced lighting and shadow effects -->
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
        </filter>
        
        <!-- Realistic fur depth filter -->
        <filter id="furDepth" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#A0824B" flood-opacity="0.3"/>
          <feDropShadow dx="-0.5" dy="-1" stdDeviation="0.8" flood-color="#F8F0E3" flood-opacity="0.6"/>
        </filter>
        
        <!-- Ambient lighting filter -->
        <filter id="ambientLight" x="-30%" y="-30%" width="160%" height="160%">
          <feDiffuseLighting in="SourceGraphic" result="light" lighting-color="#FFF8DC">
            <feDistantLight azimuth="45" elevation="60"/>
          </feDiffuseLighting>
          <feComposite in="light" in2="SourceGraphic" operator="multiply"/>
        </filter>
      </defs>
      
      <!-- Realistic shadow -->
      <ellipse cx="100" cy="225" rx="70" ry="18" fill="rgba(0,0,0,0.15)" filter="url(#softShadow)"/>
      
      <!-- Tail with realistic curve and fur -->
      <g transform="translate(150,195) rotate(${tailSway})">
        <path d="M0,0 Q25,-25 20,-50 Q15,-75 25,-100 Q30,-110 35,-115" 
              stroke="url(#bodyGradient)" stroke-width="16" stroke-linecap="round"/>
        <path d="M0,0 Q25,-25 20,-50 Q15,-75 25,-100 Q30,-110 35,-115" 
              stroke="url(#tabbyStripes)" stroke-width="14" stroke-linecap="round"/>
        <!-- Tail tip -->
        <circle cx="35" cy="-115" r="8" fill="url(#bodyGradient)"/>
      </g>
      
      <!-- Back legs with better anatomy -->
      <ellipse cx="82" cy="205" rx="10" ry="28" fill="url(#bodyGradient)"/>
      <ellipse cx="118" cy="205" rx="10" ry="28" fill="url(#bodyGradient)"/>
      <!-- Paws -->
      <ellipse cx="82" cy="225" r="8" fill="#8B4513"/>
      <ellipse cx="118" cy="225" r="8" fill="#8B4513"/>
      <!-- Paw pads -->
      <ellipse cx="82" cy="225" rx="4" ry="6" fill="#654321"/>
      <ellipse cx="118" cy="225" rx="4" ry="6" fill="#654321"/>
      
      <!-- Body with enhanced realistic proportions and depth -->
      <ellipse cx="100" cy="165" rx="${55 * breathingScale}" ry="${42 * breathingScale}" 
               fill="url(#bodyGradient)" filter="url(#furDepth)" transform="scale(${breathingScale})"/>
      <ellipse cx="100" cy="165" rx="${52 * breathingScale}" ry="${38 * breathingScale}" 
               fill="url(#deepFurPattern)" opacity="0.4" transform="scale(${breathingScale})"/>
      <ellipse cx="100" cy="165" rx="${50 * breathingScale}" ry="${36 * breathingScale}" 
               fill="url(#furPattern)" opacity="0.6" transform="scale(${breathingScale})"/>
      <ellipse cx="100" cy="165" rx="${48 * breathingScale}" ry="${35 * breathingScale}" 
               fill="url(#tabbyStripes)" opacity="0.7" transform="scale(${breathingScale})"/>
      
      <!-- Front legs -->
      <ellipse cx="78" cy="190" rx="8" ry="22" fill="url(#bodyGradient)"/>
      <ellipse cx="122" cy="190" rx="8" ry="22" fill="url(#bodyGradient)"/>
      <!-- Front paws -->
      <ellipse cx="78" cy="205" r="6" fill="#8B4513"/>
      <ellipse cx="122" cy="205" r="6" fill="#8B4513"/>
      
      <!-- Neck with realistic connection -->
      <ellipse cx="100" cy="130" rx="28" ry="22" fill="url(#bodyGradient)"/>
      <ellipse cx="100" cy="130" rx="25" ry="19" fill="url(#furPattern)" opacity="0.5"/>
      
      <!-- Head with better proportions -->
      <ellipse cx="100" cy="100" rx="38" ry="35" fill="url(#bodyGradient)"/>
      <ellipse cx="100" cy="100" rx="35" ry="32" fill="url(#furPattern)" opacity="0.4"/>
      <ellipse cx="100" cy="100" rx="32" ry="29" fill="url(#tabbyStripes)" opacity="0.6"/>
      
      <!-- Ears with realistic shape -->
      <g id="ears">
        <!-- Outer ears -->
        <path d="M72,78 Q78,58 88,68 Q92,78 85,82 Z" fill="url(#bodyGradient)"/>
        <path d="M108,78 Q115,58 125,68 Q118,78 112,82 Z" fill="url(#bodyGradient)"/>
        <!-- Inner ears -->
        <path d="M76,74 Q80,65 84,72 Q86,76 82,78 Z" fill="#FFB6C1"/>
        <path d="M114,74 Q118,65 122,72 Q116,76 116,78 Z" fill="#FFB6C1"/>
        <!-- Ear fur tufts -->
        <path d="M78,60 Q80,55 82,60" stroke="url(#bodyGradient)" stroke-width="2"/>
        <path d="M118,60 Q120,55 122,60" stroke="url(#bodyGradient)" stroke-width="2"/>
      </g>
      
      <!-- Enhanced eyes with depth -->
      <g id="eyes">
        <!-- Eye whites -->
        <ellipse cx="88" cy="95" rx="10" ry="${eyeHeight + 1}" fill="#FFFAF0"/>
        <ellipse cx="112" cy="95" rx="10" ry="${eyeHeight + 1}" fill="#FFFAF0"/>
        <!-- Iris -->
        <ellipse cx="88" cy="95" rx="8" ry="${eyeHeight}" fill="url(#eyeGradient)"/>
        <ellipse cx="112" cy="95" rx="8" ry="${eyeHeight}" fill="url(#eyeGradient)"/>
        <!-- Pupils -->
        <ellipse cx="88" cy="96" rx="3" ry="${pupilHeight}" fill="url(#pupilGradient)"/>
        <ellipse cx="112" cy="96" rx="3" ry="${pupilHeight}" fill="url(#pupilGradient)"/>
        <!-- Eye highlights -->
        <ellipse cx="90" cy="93" rx="1.5" ry="${Math.max(0.8, eyeHeight - 6)}" fill="#FFF" opacity="0.9"/>
        <ellipse cx="114" cy="93" rx="1.5" ry="${Math.max(0.8, eyeHeight - 6)}" fill="#FFF" opacity="0.9"/>
        <!-- Secondary highlights -->
        <circle cx="86" cy="98" r="0.8" fill="#FFF" opacity="0.6"/>
        <circle cx="110" cy="98" r="0.8" fill="#FFF" opacity="0.6"/>
      </g>
      
      <!-- Enhanced nose with realistic shape -->
      <path d="M96,106 Q100,103 104,106 Q100,110 96,106 Z" fill="url(#noseGradient)"/>
      <!-- Nose highlight -->
      <ellipse cx="99" cy="105" rx="1" ry="0.8" fill="#FFF" opacity="0.7"/>
      
      <!-- Mouth with better anatomy -->
      <path d="M100,110 Q94,114 88,112" stroke="#8B4513" stroke-width="1.5" fill="none"/>
      <path d="M100,110 Q106,114 112,112" stroke="#8B4513" stroke-width="1.5" fill="none"/>
      <!-- Chin curve -->
      <path d="M95,112 Q100,115 105,112" stroke="#A0824B" stroke-width="0.8" fill="none" opacity="0.6"/>
      
      <!-- Realistic whiskers with varying lengths -->
      <g stroke="#8B4513" stroke-width="1.2" opacity="0.9">
        <!-- Left whiskers -->
        <path d="M68,98 Q50,96 45,95"/>
        <path d="M68,103 Q48,103 42,103"/>
        <path d="M68,108 Q50,110 45,112"/>
        <!-- Right whiskers -->
        <path d="M132,98 Q150,96 155,95"/>
        <path d="M132,103 Q152,103 158,103"/>
        <path d="M132,108 Q150,110 155,112"/>
      </g>
      
      <!-- Chest marking with natural shape -->
      <ellipse cx="100" cy="150" rx="15" ry="10" fill="#FFF" opacity="0.9"/>
      <ellipse cx="100" cy="148" rx="12" ry="7" fill="#FFFAF0" opacity="0.7"/>
      
      <!-- Additional facial markings -->
      <ellipse cx="100" cy="85" rx="8" ry="4" fill="#FFF" opacity="0.6"/>
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

    // Enhanced movement dynamics
    const bodyLean = Math.min(speed * 6, 18)
    const legCycle = Math.sin(frame * 0.4) * 8
    const tailTrail = -direction * 25 + Math.sin(frame * 0.25) * 15
    const earFlop = Math.min(speed * 2, 8)

    const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Enhanced movement gradients -->
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F5E6D3"/>
          <stop offset="30%" stop-color="#E8D4B7"/>
          <stop offset="70%" stop-color="#D2B48C"/>
          <stop offset="100%" stop-color="#C19A6B"/>
        </linearGradient>
        
        <!-- Realistic fur texture pattern -->
        <pattern id="furPattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(15)">
          <circle cx="2" cy="2" r="0.8" fill="#E8D4B7" opacity="0.6"/>
          <circle cx="6" cy="4" r="0.6" fill="#D2B48C" opacity="0.4"/>
          <circle cx="4" cy="6" r="0.5" fill="#C19A6B" opacity="0.3"/>
        </pattern>
        
        <!-- Tabby stripes pattern -->
        <pattern id="tabbyStripes" patternUnits="userSpaceOnUse" width="12" height="8" patternTransform="rotate(25)">
          <path d="M0,2 Q6,0 12,2 M0,6 Q6,4 12,6" stroke="#A0824B" stroke-width="1.2" opacity="0.7"/>
          <path d="M2,0 Q8,2 10,8 M6,0 Q10,4 12,8" stroke="#8B6914" stroke-width="0.8" opacity="0.5"/>
        </pattern>
        
        <!-- Eye gradient for focused running -->
        <radialGradient id="eyeGradient" cx="30%" cy="25%">
          <stop offset="0%" stop-color="#7FFF00"/>
          <stop offset="40%" stop-color="#32CD32"/>
          <stop offset="80%" stop-color="#228B22"/>
          <stop offset="100%" stop-color="#006400"/>
        </radialGradient>
        
        <!-- Nose gradient -->
        <linearGradient id="noseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFB6C1"/>
          <stop offset="50%" stop-color="#FF69B4"/>
          <stop offset="100%" stop-color="#CD5C5C"/>
        </linearGradient>
        
        <!-- Motion blur effect -->
        <filter id="motionBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${Math.min(speed * 0.5, 2)} 0"/>
        </filter>
      </defs>
      
      <g transform="translate(100,120) rotate(${bodyLean * Math.cos(direction)}) translate(-100,-120)">
        <!-- Dynamic shadow -->
        <ellipse cx="${100 + speed * 2}" cy="225" rx="${70 + speed * 3}" ry="18" fill="rgba(0,0,0,0.15)" filter="url(#motionBlur)"/>
        
        <!-- Tail with realistic movement -->
        <g transform="translate(150,195) rotate(${tailTrail})">
          <path d="M0,0 Q25,-25 20,-50 Q15,-75 25,-100 Q30,-110 35,-115" 
                stroke="url(#bodyGradient)" stroke-width="16" stroke-linecap="round"/>
          <path d="M0,0 Q25,-25 20,-50 Q15,-75 25,-100 Q30,-110 35,-115" 
                stroke="url(#tabbyStripes)" stroke-width="14" stroke-linecap="round"/>
          <!-- Tail tip -->
          <circle cx="35" cy="-115" r="8" fill="url(#bodyGradient)"/>
        </g>
        
        <!-- Body with motion stretch -->
        <ellipse cx="100" cy="165" rx="${55 + speed * 2}" ry="${42 - speed * 1}" fill="url(#bodyGradient)"/>
        <ellipse cx="100" cy="165" rx="${52 + speed * 2}" ry="${38 - speed * 1}" fill="url(#furPattern)" opacity="0.6"/>
        <ellipse cx="100" cy="165" rx="${48 + speed * 2}" ry="${35 - speed * 1}" fill="url(#tabbyStripes)" opacity="0.7"/>
        
        <!-- Legs with realistic running motion -->
        <ellipse cx="${82 + legCycle}" cy="205" rx="10" ry="28" fill="url(#bodyGradient)"/>
        <ellipse cx="${118 - legCycle}" cy="205" rx="10" ry="28" fill="url(#bodyGradient)"/>
        <ellipse cx="${78 - legCycle}" cy="190" rx="8" ry="22" fill="url(#bodyGradient)"/>
        <ellipse cx="${122 + legCycle}" cy="190" rx="8" ry="22" fill="url(#bodyGradient)"/>
        
        <!-- Paws in motion -->
        <ellipse cx="${82 + legCycle}" cy="225" r="8" fill="#8B4513"/>
        <ellipse cx="${118 - legCycle}" cy="225" r="8" fill="#8B4513"/>
        <ellipse cx="${78 - legCycle}" cy="205" r="6" fill="#8B4513"/>
        <ellipse cx="${122 + legCycle}" cy="205" r="6" fill="#8B4513"/>
        
        <!-- Neck in motion -->
        <ellipse cx="100" cy="130" rx="28" ry="22" fill="url(#bodyGradient)"/>
        <ellipse cx="100" cy="130" rx="25" ry="19" fill="url(#furPattern)" opacity="0.5"/>
        
        <!-- Head with focused expression -->
        <ellipse cx="100" cy="100" rx="38" ry="35" fill="url(#bodyGradient)"/>
        <ellipse cx="100" cy="100" rx="35" ry="32" fill="url(#furPattern)" opacity="0.4"/>
        <ellipse cx="100" cy="100" rx="32" ry="29" fill="url(#tabbyStripes)" opacity="0.6"/>
        
        <!-- Ears flattened in motion -->
        <g id="ears">
          <!-- Outer ears -->
          <path d="M72,${78 + earFlop} Q78,${58 + earFlop} 88,${68 + earFlop} Q92,${78 + earFlop} 85,${82 + earFlop} Z" fill="url(#bodyGradient)"/>
          <path d="M108,${78 + earFlop} Q115,${58 + earFlop} 125,${68 + earFlop} Q118,${78 + earFlop} 112,${82 + earFlop} Z" fill="url(#bodyGradient)"/>
          <!-- Inner ears -->
          <path d="M76,${74 + earFlop} Q80,${65 + earFlop} 84,${72 + earFlop} Q86,${76 + earFlop} 82,${78 + earFlop} Z" fill="#FFB6C1"/>
          <path d="M114,${74 + earFlop} Q118,${65 + earFlop} 122,${72 + earFlop} Q116,${76 + earFlop} 116,${78 + earFlop} Z" fill="#FFB6C1"/>
        </g>
        
        <!-- Eyes focused and alert -->
        <g id="eyes">
          <!-- Eye whites -->
          <ellipse cx="88" cy="95" rx="10" ry="7" fill="#FFFAF0"/>
          <ellipse cx="112" cy="95" rx="10" ry="7" fill="#FFFAF0"/>
          <!-- Iris -->
          <ellipse cx="88" cy="95" rx="8" ry="6" fill="url(#eyeGradient)"/>
          <ellipse cx="112" cy="95" rx="8" ry="6" fill="url(#eyeGradient)"/>
          <!-- Pupils (dilated for focus) -->
          <ellipse cx="88" cy="96" rx="4" ry="3" fill="#000"/>
          <ellipse cx="112" cy="96" rx="4" ry="3" fill="#000"/>
          <!-- Eye highlights -->
          <ellipse cx="90" cy="93" rx="1.5" ry="1" fill="#FFF" opacity="0.9"/>
          <ellipse cx="114" cy="93" rx="1.5" ry="1" fill="#FFF" opacity="0.9"/>
        </g>
        
        <!-- Nose -->
        <path d="M96,106 Q100,103 104,106 Q100,110 96,106 Z" fill="url(#noseGradient)"/>
        <ellipse cx="99" cy="105" rx="1" ry="0.8" fill="#FFF" opacity="0.7"/>
        
        <!-- Mouth with slight panting -->
        <path d="M100,110 Q94,115 88,113" stroke="#8B4513" stroke-width="1.5" fill="none"/>
        <path d="M100,110 Q106,115 112,113" stroke="#8B4513" stroke-width="1.5" fill="none"/>
        <!-- Slight tongue visibility -->
        <ellipse cx="100" cy="114" rx="2" ry="1" fill="#FF69B4" opacity="0.7"/>
        
        <!-- Whiskers blown back by wind -->
        <g stroke="#8B4513" stroke-width="1.2" opacity="0.8">
          <!-- Left whiskers -->
          <path d="M68,98 Q${50 - speed * 4},${96 - speed * 2} ${45 - speed * 5},${95 - speed * 2}"/>
          <path d="M68,103 Q${48 - speed * 4},103 ${42 - speed * 5},103"/>
          <path d="M68,108 Q${50 - speed * 4},${110 + speed * 2} ${45 - speed * 5},${112 + speed * 2}"/>
          <!-- Right whiskers -->
          <path d="M132,98 Q${150 + speed * 4},${96 - speed * 2} ${155 + speed * 5},${95 - speed * 2}"/>
          <path d="M132,103 Q${152 + speed * 4},103 ${158 + speed * 5},103"/>
          <path d="M132,108 Q${150 + speed * 4},${110 + speed * 2} ${155 + speed * 5},${112 + speed * 2}"/>
        </g>
        
        <!-- Chest marking -->
        <ellipse cx="100" cy="150" rx="15" ry="10" fill="#FFF" opacity="0.9"/>
        <ellipse cx="100" cy="148" rx="12" ry="7" fill="#FFFAF0" opacity="0.7"/>
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

    const breathingScale = 1 + Math.sin(frame * 0.015) * 0.04
    const dreamFloat = Math.sin(frame * 0.008) * 2
    
    const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Enhanced sleeping gradients -->
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F5E6D3"/>
          <stop offset="30%" stop-color="#E8D4B7"/>
          <stop offset="70%" stop-color="#D2B48C"/>
          <stop offset="100%" stop-color="#C19A6B"/>
        </linearGradient>
        
        <!-- Dreamy fur texture -->
        <pattern id="furPattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(15)">
          <circle cx="2" cy="2" r="0.8" fill="#E8D4B7" opacity="0.4"/>
          <circle cx="6" cy="4" r="0.6" fill="#D2B48C" opacity="0.3"/>
          <circle cx="4" cy="6" r="0.5" fill="#C19A6B" opacity="0.2"/>
        </pattern>
        
        <!-- Soft tabby stripes -->
        <pattern id="tabbyStripes" patternUnits="userSpaceOnUse" width="12" height="8" patternTransform="rotate(25)">
          <path d="M0,2 Q6,0 12,2 M0,6 Q6,4 12,6" stroke="#A0824B" stroke-width="1" opacity="0.4"/>
          <path d="M2,0 Q8,2 10,8 M6,0 Q10,4 12,8" stroke="#8B6914" stroke-width="0.6" opacity="0.3"/>
        </pattern>
        
        <!-- Peaceful sleep glow -->
        <filter id="sleepGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
        </filter>
        
        <!-- Dream Z gradient -->
        <linearGradient id="dreamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E6F3FF"/>
          <stop offset="50%" stop-color="#B3D9FF"/>
          <stop offset="100%" stop-color="#87CEEB"/>
        </linearGradient>
      </defs>
      
      <!-- Soft shadow -->
      <ellipse cx="100" cy="230" rx="90" ry="25" fill="rgba(0,0,0,0.1)" filter="url(#sleepGlow)"/>
      
      <!-- Curled up body with realistic pose -->
      <ellipse cx="100" cy="185" rx="${65 * breathingScale}" ry="${48 * breathingScale}" 
               fill="url(#bodyGradient)" transform="scale(${breathingScale})" opacity="0.95"/>
      <ellipse cx="100" cy="185" rx="${60 * breathingScale}" ry="${43 * breathingScale}" 
               fill="url(#furPattern)" opacity="0.5" transform="scale(${breathingScale})"/>
      <ellipse cx="100" cy="185" rx="${55 * breathingScale}" ry="${38 * breathingScale}" 
               fill="url(#tabbyStripes)" opacity="0.6" transform="scale(${breathingScale})"/>
      
      <!-- Legs tucked under -->
      <ellipse cx="85" cy="200" rx="8" ry="15" fill="url(#bodyGradient)" opacity="0.8"/>
      <ellipse cx="115" cy="200" rx="8" ry="15" fill="url(#bodyGradient)" opacity="0.8"/>
      
      <!-- Head tucked in with peaceful expression -->
      <ellipse cx="100" cy="155" rx="32" ry="28" fill="url(#bodyGradient)"/>
      <ellipse cx="100" cy="155" rx="28" ry="24" fill="url(#furPattern)" opacity="0.4"/>
      <ellipse cx="100" cy="155" rx="24" ry="20" fill="url(#tabbyStripes)" opacity="0.5"/>
      
      <!-- Ears tucked back -->
      <g id="ears">
        <path d="M78,140 Q82,130 86,138 Q88,142 84,144 Z" fill="url(#bodyGradient)" opacity="0.9"/>
        <path d="M114,140 Q118,130 122,138 Q116,142 116,144 Z" fill="url(#bodyGradient)" opacity="0.9"/>
        <path d="M80,138 Q82,134 84,138" fill="#FFB6C1" opacity="0.7"/>
        <path d="M116,138 Q118,134 120,138" fill="#FFB6C1" opacity="0.7"/>
      </g>
      
      <!-- Peaceful closed eyes -->
      <g id="eyes">
        <!-- Eye shapes -->
        <path d="M88,150 Q92,147 96,150" stroke="#654321" stroke-width="2" fill="none" opacity="0.8"/>
        <path d="M104,150 Q108,147 112,150" stroke="#654321" stroke-width="2" fill="none" opacity="0.8"/>
        <!-- Eyelashes -->
        <path d="M89,149 L90,147 M92,148 L93,146 M95,149 L96,147" stroke="#654321" stroke-width="0.8" opacity="0.6"/>
        <path d="M105,149 L106,147 M108,148 L109,146 M111,149 L112,147" stroke="#654321" stroke-width="0.8" opacity="0.6"/>
      </g>
      
      <!-- Peaceful nose -->
      <ellipse cx="100" cy="160" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.8"/>
      <ellipse cx="100" cy="159" rx="0.8" ry="0.5" fill="#FFF" opacity="0.6"/>
      
      <!-- Relaxed mouth -->
      <path d="M98,162 Q100,164 102,162" stroke="#8B4513" stroke-width="1" fill="none" opacity="0.6"/>
      
      <!-- Tail wrapped around body -->
      <path d="M145,205 Q165,185 155,165 Q145,145 125,155 Q105,165 95,175 Q85,185 90,195" 
            stroke="url(#bodyGradient)" stroke-width="18" stroke-linecap="round" opacity="0.9"/>
      <path d="M145,205 Q165,185 155,165 Q145,145 125,155 Q105,165 95,175 Q85,185 90,195" 
            stroke="url(#tabbyStripes)" stroke-width="16" stroke-linecap="round" opacity="0.6"/>
      <!-- Tail tip -->
      <circle cx="90" cy="195" r="9" fill="url(#bodyGradient)" opacity="0.9"/>
      
      <!-- Whiskers at rest -->
      <g stroke="#8B4513" stroke-width="0.8" opacity="0.5">
        <path d="M75,158 Q65,158 60,158"/>
        <path d="M75,162 Q65,162 60,162"/>
        <path d="M125,158 Q135,158 140,158"/>
        <path d="M125,162 Q135,162 140,162"/>
      </g>
      
      <!-- Chest marking visible -->
      <ellipse cx="100" cy="170" rx="12" ry="6" fill="#FFF" opacity="0.7"/>
      
      <!-- Dream symbols floating with gentle animation -->
      <g opacity="${0.6 + Math.sin(frame * 0.01) * 0.2}" transform="translate(0,${dreamFloat})">
        <!-- Dreams represented as soft Z's -->
        <text x="140" y="120" font-family="Arial" font-size="14" font-weight="normal" fill="url(#dreamGradient)" opacity="0.8">Z</text>
        <text x="150" y="100" font-family="Arial" font-size="18" font-weight="normal" fill="url(#dreamGradient)" opacity="0.7">Z</text>
        <text x="160" y="80" font-family="Arial" font-size="22" font-weight="normal" fill="url(#dreamGradient)" opacity="0.6">Z</text>
        
        <!-- Dreamy particles -->
        <circle cx="135" cy="115" r="1" fill="url(#dreamGradient)" opacity="0.4"/>
        <circle cx="155" cy="95" r="0.8" fill="url(#dreamGradient)" opacity="0.3"/>
        <circle cx="165" cy="75" r="1.2" fill="url(#dreamGradient)" opacity="0.3"/>
      </g>
      
      <!-- Peaceful breathing indicator -->
      <ellipse cx="100" cy="175" rx="${8 * breathingScale}" ry="${3 * breathingScale}" 
               fill="#FFF" opacity="${0.3 + Math.sin(frame * 0.015) * 0.1}"/>
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
    canvas.width = 300
    canvas.height = 300
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
          
          // Create initial texture first
          const initialTexture = this.svgTextureManager.generateIdleTexture(0, 'open')
          await this.svgTextureManager.createTextureFromSVG('cat-initial', initialTexture)
          
          // Create cat sprite centered in viewport
          const centerX = this.cameras.main.width / 2
          const centerY = this.cameras.main.height / 2
          this.cat = this.matter.add.sprite(centerX, centerY, 'cat-initial')
          this.cat.setFixedRotation()
          
          // Ensure the cat sprite displays at full size (SVG is now 300x300)
          this.cat.setDisplaySize(300, 300)
          
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
          const ripple = this.add.circle(x, y, 5, 0x7FFF00, 0.6)
          
          this.tweens.add({
            targets: ripple,
            radius: 30,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => ripple.destroy()
          })
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
          // Simulate ear twitching through subtle scale changes
          this.tweens.add({
            targets: this.cat,
            scaleX: 1 + (Math.random() - 0.5) * 0.02,
            duration: 300,
            ease: 'Power2.easeInOut',
            yoyo: true
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