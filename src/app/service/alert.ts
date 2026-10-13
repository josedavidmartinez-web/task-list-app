import { Service, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';


//El decorador @Service(): Marca la clase como 
//un servicio que puede se inyectado en otros
//componentes o servicios de Agular. 

@Service()
export class Alert 
{
    //AlertController: Servicio propio de Ionic
    //que permite crear y controlar aletas
    private alertController: AlertController = inject(AlertController);

     async AlertMessage(
        header:string, // Titulo de la alerta
        message:string // Mensaje de la alerta
    ) {
        //Hace un Wait para crear la alerta
        //con el header y el message.
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    //present(): es un metodo que muestra la 
    //alerta en la pantalla.
    await alert.present();
  }
  async alertConfirm(
    header:string, // Titulo de la alerta
    subHeader:string, // Subtitulo de la alerta
    message:string, // Mensaje de la alerta
    functionOk: Function, // Función que se ejecutará si el usuario confirma la acción
    cancelText: string = 'Cancelar', // Texto del botón de cancelar
    confrimText: string = 'Confirmar' // Texto del botón de confirmar

  ){
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
      text: 'Canceltext',
      role: 'cancel',
     
    },
    {
      text: 'ConfirmText',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },

      ],
    });
    await alert.present();
  }
}