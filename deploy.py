#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de despliegue automatizado para MarketSphere
Este script ayuda a verificar que todo esté listo para el despliegue
"""

import os
import sys
import subprocess
from pathlib import Path

# Configurar encoding para Windows
if sys.platform.startswith('win'):
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def check_requirements():
    """Verificar que todos los archivos necesarios existen"""
    print("Verificando archivos necesarios...")
    
    required_files = [
        'requirements.txt',
        '.env.production',
        'wsgi_pythonanywhere.py',
        'DEPLOYMENT_INSTRUCTIONS.md',
        'frontend/.env.production',
        'frontend/package.json'
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print("X Archivos faltantes:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("OK Todos los archivos necesarios están presentes")
    return True

def check_environment_variables():
    """Verificar variables de entorno en archivos .env"""
    print("\nVerificando variables de entorno...")
    
    # Verificar .env.production del backend
    env_file = Path('.env.production')
    if env_file.exists():
        content = env_file.read_text()
        if 'tu-usuario' in content.lower() or 'replace' in content.lower():
            print("AVISO: Necesitas actualizar .env.production con tus datos reales")
            print("   - Reemplaza 'tu-usuario' con tu usuario de PythonAnywhere")
            print("   - Configura las credenciales de MySQL")
            return False
    
    # Verificar .env.production del frontend
    frontend_env = Path('frontend/.env.production')
    if frontend_env.exists():
        content = frontend_env.read_text()
        if 'tu-usuario' in content.lower():
            print("AVISO: Necesitas actualizar frontend/.env.production")
            print("   - Reemplaza con tu URL real de PythonAnywhere")
            return False
    
    print("OK Variables de entorno configuradas")
    return True

def check_git_status():
    """Verificar estado de Git"""
    print("\nVerificando estado de Git...")
    
    try:
        # Verificar si hay cambios sin commit
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True, check=True)
        
        if result.stdout.strip():
            print("AVISO: Hay cambios sin commit:")
            print(result.stdout)
            print("   Ejecuta: git add . && git commit -m 'Ready for deployment'")
            return False
        
        print("OK Git está limpio y listo")
        return True
        
    except subprocess.CalledProcessError:
        print("AVISO: No es un repositorio Git o Git no está instalado")
        print("   Inicializa Git: git init")
        return False

def run_tests():
    """Ejecutar pruebas básicas"""
    print("\nEjecutando verificaciones básicas...")
    
    try:
        # Verificar que Django puede importarse
        subprocess.run([sys.executable, '-c', 'import django; print("Django OK")'], 
                      check=True, capture_output=True)
        
        # Verificar sintaxis de settings.py
        subprocess.run([sys.executable, '-c', 'from bloquesite import settings'], 
                      check=True, capture_output=True)
        
        print("OK Verificaciones básicas pasaron")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"ERROR en verificaciones: {e}")
        return False

def show_deployment_summary():
    """Mostrar resumen de despliegue"""
    print("\n" + "="*60)
    print("RESUMEN DE DESPLIEGUE")
    print("="*60)
    print("\nArchivos preparados:")
    print("   OK Backend configurado para PythonAnywhere")
    print("   OK Frontend configurado para Vercel")
    print("   OK Variables de entorno configuradas")
    print("   OK WSGI file para PythonAnywhere")
    
    print("\nProximos pasos:")
    print("   1. Sube el código a GitHub")
    print("   2. Sigue DEPLOYMENT_INSTRUCTIONS.md")
    print("   3. Configura PythonAnywhere")
    print("   4. Despliega en Vercel")
    
    print("\nDocumentacion:")
    print("   - DEPLOYMENT_INSTRUCTIONS.md (guía completa)")
    print("   - .env.production (configuración backend)")
    print("   - frontend/.env.production (configuración frontend)")
    
    print("\nURLs finales:")
    print("   - Frontend: https://tu-proyecto.vercel.app")
    print("   - Backend: https://tu-usuario.pythonanywhere.com")
    print("   - Admin: https://tu-usuario.pythonanywhere.com/admin")

def main():
    """Función principal"""
    print("MarketSphere - Verificador de Despliegue")
    print("="*50)
    
    # Cambiar al directorio del script
    os.chdir(Path(__file__).parent)
    
    checks = [
        check_requirements(),
        check_environment_variables(),
        check_git_status(),
        run_tests()
    ]
    
    if all(checks):
        print("\nTodo listo para el despliegue!")
        show_deployment_summary()
        return 0
    else:
        print("\nHay problemas que resolver antes del despliegue")
        print("   Revisa los mensajes anteriores y corrige los errores")
        return 1

if __name__ == '__main__':
    sys.exit(main())