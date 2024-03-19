import { BBVAController } from './modules/parsing/controllers/bbva.controller';


async function main(): Promise<void> {
    const content: any = await new BBVAController().parseFromUrl(
      "",
      true
    )
    console.log(content.movements)
}


main()
