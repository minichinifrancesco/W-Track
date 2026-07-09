import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { CoachController } from "./coach.controller";
import { CoachService } from "./coach.service";
import { CoachRepository } from "./repositories/coach.repository";

@Module({
    imports: [PrismaModule],
    controllers: [CoachController],
    providers: [CoachService, CoachRepository],
})
export class CoachModule{}