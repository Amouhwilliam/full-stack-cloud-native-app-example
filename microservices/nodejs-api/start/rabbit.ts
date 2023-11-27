/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Rabbit from '@ioc:Adonis/Addons/Rabbit'

async function listen() {
  await Rabbit.assertQueue('to_node_app_queue')
  console.log("RABBIT_MQ LISTENNING");

  await Rabbit.consumeFrom('to_node_app_queue', (message) => {
    console.log(message.content)
  })
}

listen().catch((err) => {console.log(err)})