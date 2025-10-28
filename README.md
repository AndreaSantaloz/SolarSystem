# SolarSystem
## 🚀 Sistema Solar Interactivo con Three.js

Un simulador del sistema solar en 3D desarrollado con Three.js que incluye una nave espacial (Halcón Milenario) con múltiples vistas de cámara.

## ✨ Características Principales
🪐 Sistema Solar Completo

    Sol: Textura realista con efecto de emisión

    9 Planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno y Plutón

    Órbitas Elípticas: Cada planeta sigue una trayectoria elíptica única

    Rotación Planetaria: Los planetas rotan sobre su eje a diferentes velocidades

    9 Satélites Naturales: Incluyendo la Luna, Fobos, Ganimedes, Ío, Titán, etc.

## 🛸 Nave Espacial - Halcón Milenario

    Modelo 3D detallado del Halcón Milenario de Star Wars

    Sistema de movimiento orbital automático

    Dos modos de cámara intercambiables

## 🎥 Sistema de Cámaras

    Cámara Externa: Vista en tercera persona con controles orbitales

    Cámara en Primera Persona: Vista desde el cockpit de la nave

    Controles suaves con amortiguación

    Intercambio instantáneo entre vistas

## 🛠️ Tecnologías Utilizadas

    Three.js - Motor de gráficos 3D

    OrbitControls - Controles de cámara orbital

    GLTFLoader - Cargador de modelos 3D

    TextureLoader - Cargador de texturas
 ## 📁 Estructura del Proyecto

 project/
├── src/
│   └── star_wars_-_halcon_milenario/
│       └── scene.gltf (Modelo 3D del Halcón Milenario)
├── textures/
│   ├── sol.jpg
│   ├── mercurio.jpg
│   ├── tierra.jpg
│   └── ... (texturas de todos los planetas)
└── script.js (Código principal)

## ⚙️ Configuración y Personalización
Escalas y Velocidades

    SOLAR_SYSTEM_SCALE: Factor de escala del sistema solar (3)

    ORBIT_SPEED: Velocidad orbital de la nave (0.2)

    ORBIT_RADIUS: Radio de la órbita de la nave (150)

## Parámetros de Planetas

Cada planeta se configura con:

    Radio del planeta

    Distancia al sol

    Velocidad orbital

    Textura

    Factores de elipticidad (f1, f2)

    Velocidad de rotación

## 🎮 Controles
Botones de Interfaz

    GeneralButton: Cambia a vista externa del sistema solar

    FalconButton: Cambia a vista desde el cockpit de la nave

Controles de Cámara

    Vista Externa: Rotar, hacer zoom y pan con el mouse

    Vista Nave: Rotar la vista desde el cockpit

## 🔧 Funcionalidades Técnicas
Animación y Física

    Sistema de animación basado en delta time

    Movimientos orbitales realistas

    Rotaciones planetarias independientes

    Interpolación suave de movimientos

## Iluminación

    Luz ambiental para iluminación general

    Luz puntual en el sol como fuente principal

    Materiales PBR (Physically Based Rendering) para planetas

## Optimización

    Tone mapping ACES Filmic para mejor rango dinámico

    Anti-aliasing habilitado

    Encoding sRGB para colores precisos

## 🚀 Cómo Usar

    Asegúrate de tener todos los archivos de texturas y modelos en las rutas correctas

    Abre el archivo HTML principal en un servidor web

    Usa los botones para cambiar entre vistas de cámara

    Interactúa con los controles de órbita en la vista externa

## 📝 Notas de Desarrollo

    El código utiliza ES6 modules

    Organización modular de funciones

    Manejo de errores en la carga de modelos

    Sistema de datos de usuario para almacenar propiedades de objetos

## 🌟 Características Destacadas

    Escala Ajustable: Sistema solar escalado para mejor visualización

    Movimiento Realista: Órbitas elípticas y rotaciones auténticas

    Interactividad Completa: Múltiples formas de explorar el sistema solar

    Rendimiento Optimizado: Animación fluida incluso con múltiples objetos

Este proyecto demuestra un uso avanzado de Three.js para crear experiencias 3D interactivas y educativas en el navegador.
