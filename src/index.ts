import { BBVAController } from './modules/parsing/controllers/bbva.controller';


async function main(): Promise<void> {
    const content: any = await new BBVAController().parseFromUrl("https://carlos-sanchez-public.s3.us-east-2.amazonaws.com/account_state_august.pdf")
    console.log(content)
}


main()
