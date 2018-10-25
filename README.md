## Primera vez
- Instalar NVM
- Instalar node: `nvm install`
- Usar node 8: `nvm use`
- Instalar dependencias: `npm install`

## Después (cada vez que se corre)
- Precondición: la API de `subscriptions` y de `trayectosporlinea` deben estar funcionando
- Exportar variables de ambiente: `export LOCAL_URL=999.999.999.999` y `export ORION_URL=169.254.1.1`
- Se puede cambiar el puerto del server con la variable de ambiente `export PORT=9999`
- Correr proyecto: `npm start`

## Misc
Se provee un conjunto de scripts en caso de querer operar fácilmente el simulador desde la consola. Ejemplos:
- `./scripts/init.sh 169.254.1.1` inicializa la simulación
- `./scripts/pausa.sh 169.254.1.1` pausa la simulación
- `./scripts/continuar.sh 169.254.1.1` continúa la simulación