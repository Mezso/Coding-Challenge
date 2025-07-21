import { Page, expect, Locator } from '@playwright/test';
import * as Common from '../utils/common';


export class Checkout {
  constructor(private page: Page) {}

    


  async FillShippingAddress(
        country: string,
        firstname: string,
        lastname: string,
        address: string,
        city: string,
        postal: string){

    await this.page.selectOption('select#order_ship_address_attributes_country_id', {
    label: country
    });

    await Common.smartFill(this.page,{
        type:'role',
        roleName:'textbox',
        value:'First name',
        textToType: firstname
    })
    await Common.smartFill(this.page,{
        type:'role',
        roleName:'textbox',
        value:'Last name',
        textToType:lastname
    })
    await Common.smartFill(this.page,{
        type:'role',
        roleName:'textbox',
        value:'Street and house number',
        textToType:address
    })
    await Common.smartFill(this.page,{
        type:'role',
        roleName:'textbox',
        value:'City',
        textToType:city
    })
    await Common.smartFill(this.page,{
        type:'role',
        roleName:'textbox',
        value:'Postal Code',
        textToType:postal
    })

    }

    async ClickSave(){

        await Common.smartClick(this.page,{
        type:'role',
        roleName:'button',
        value:'Save and Continue',
    });

    }

    
    async getDeliveryMethod(deliveryName : string): Promise<string | null> {

        const DeliveryMethod: Locator = await Common.smartGet(this.page, {
          type: 'xpath',
          value: `//label[contains(text(),'${deliveryName}')]`
        });
    
        return await DeliveryMethod.textContent();
    }

    async getDeliveryDays(deliveryName : string): Promise<string | null> {

        const DeliveryDays: Locator = await Common.smartGet(this.page, {
          type: 'xpath',
          value: `//label[contains(text(),'${deliveryName}')]/span`
        });
    
        return await DeliveryDays.textContent();
    }

    async getDeliveryPrice(deliveryName : string): Promise<string | null> {

        const DeliveryPrice: Locator = await Common.smartGet(this.page, {
          type: 'xpath',
          value: `//label[contains(text(),'${deliveryName}')]/parent::div/span`
        });
    
        return await DeliveryPrice.textContent();
    }

    async clickDeliveryMethod(deliveryName : string){

        await Common.smartClick(this.page,{
            type:'xpath',
            value:`//label[contains(text(),'${deliveryName}')]/preceding-sibling::input`
        });
        
    }
    
    async clickPaymentMethod(paymenthMethod : string){

        await Common.smartClick(this.page,{
            type:'xpath',
            value:`	//a[contains(., '${paymenthMethod}')]/input`
        });
        
    }
    async getPaymentMethod(paymenthMethod : string) {

         const method: Locator = await Common.smartGet(this.page,{
            type:'xpath',
            value:`	//a[contains(., '${paymenthMethod}')]`
        });

        return await method.textContent();

    }
    async FillCardDetails(cardType : string, cardDetails : string, expDate : string , secCode : string){  
        
        // await Common.smartClick(this.page,{
        //     type:'testid',
        //     value:cardType,
        //     frameSelector:'iframe[name^="__privateStripeFrame]'
        // });

        await this.page
  .locator('[title="Secure payment input frame"]')  // <-- fixed here
  .contentFrame()
  .getByTestId('card')
  .click();


        await Common.smartFill(this.page,{
            type:'xpath',
            value:"//input[contains(@id,'Field-numberInput')]",
            textToType: cardDetails,
            frameSelector:'iframe[title="Secure payment input frame"]'
        });

        await Common.smartFill(this.page,{
            type:'xpath',
            value:"//input[contains(@id,'Field-expiryInput')]",
            roleName:'Expiration date MM / YY',
            textToType: expDate,
            frameSelector:'iframe[title="Secure payment input frame"]'
            
        });

        await Common.smartFill(this.page,{
            type:'xpath',
            value:"//input[contains(@id,'Field-cvcInput')]",
            roleName:'Security code',
            textToType: secCode,
            frameSelector:'iframe[title="Secure payment input frame"]'
            
        });


    }

    async fillCardDetailsWithRetry(
        cardType: string,
        cardDetails: string,
        expDate: string,
        secCode: string
    ) {
        await Common.retry(() =>
            this.FillCardDetails(cardType, cardDetails, expDate, secCode),3,500); // wait 500ms between attempts
        }
    async ClickPayNow(){

        await Common.smartClick(this.page,{
        type:'role',
        roleName:'button',
        value:'Pay Now',
    });

    }

    async getOrderNumber(){

        const method: Locator = await Common.smartGet(this.page,{
            type:'xpath',
            value:"//p[contains(text(),'Order')]/strong"
        })

        return await method.textContent();
    }

    async getOrderConfirmation(){

        const method: Locator = await Common.smartGet(this.page,{
            type:'role',
            roleName:'heading',
            value: /your order is confirmed!/i
        })

        return await method.textContent();
    }
      
    


    



}

