/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/', async () => {
  return "Welcome !"
})

Route.group(async () => {

  Route.get('/', async () => {
    return "Welcome to devices api !"
  })

  Route.get('/devices',"DevicesController.getDevices")

  Route.get('/devices/:id',"DevicesController.getDevice").where('id', {
    match: /^[0-9]+$/, cast: (id) => Number(id),
  })

  Route.post('/devices',"DevicesController.createDevice")

  Route.patch('/devices/:id', "DevicesController.updateDevice").where('id', {
    match: /^[0-9]+$/, cast: (id) => Number(id),
  })

  Route.delete('/devices/:id',"DevicesController.deleteDevice").where('id', {
    match: /^[0-9]+$/, cast: (id) => Number(id),
  })

}).prefix('api/v1')

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy
    ? response.ok(report)
    : response.badRequest(report)
})

