import { Repairs, User } from "../../data"
import { CustomError } from "../../domain"
import { CreateRepairsDto } from "../../domain/dtos/repairs/create.repairs.dto"
import { UpdateRepairsDto } from "../../domain/dtos/repairs/update.repairs.dto"
import { AuthService } from "./auth.service"

enum RepairsStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

enum UserStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED'
}

export class RepairService {
    
    constructor(
    ){}
    
    async createRepair(repairData: CreateRepairsDto) {
        const user = await User.findOne({ where: { id: repairData.userId } });
    
        if (!user) {
          throw CustomError.notFound("User not found");
        }
    
        const newRepair = new Repairs();
        newRepair.date = repairData.date
        newRepair.motorsNumber = repairData.motorsNumber
        newRepair.description = repairData.description
        newRepair.user = user
    
        try {
          const result = await newRepair.save();
          return result;
        } catch (error) {
          console.error("Error creating repair:", error);
          throw CustomError.internalServer("Failed to create repair");
        }
      }

    async findAllRepairs() {
        try {
            const result = await Repairs.find({
                where: {
                    repairStatus: RepairsStatus.PENDING
                }
            })
            return result
        } catch (error) {
            throw CustomError.internalServer("Something went very wrong" );
        }
    }
    
    async findOneRepair(id: number) {
        try {
            const result = await Repairs.findOne({ where: { id } })
            return result
        } catch (error) {
            throw CustomError.notFound("Repair not found");
        }
    }

    async updateRepair(id: number, repair: UpdateRepairsDto) {
        const user = await User.findOne({ where: { id: repair.userId } });
        const updatedRepair = await this.findOneRepair(id)
        updatedRepair.date = repair.date
        updatedRepair.repairStatus = repair.status
        updatedRepair.user = user
        try {
            const result = await updatedRepair.save()
            return result
        } catch (error) {
            throw CustomError.internalServer("Something went very wrong" );
        }
    }

    async deleteRepair(id: number) {
        const repair = await this.findOneRepair(id)

        repair.repairStatus = RepairsStatus.CANCELLED

        try {
            await repair.save()
            return ("Repair completed")
        } catch (error) {    
            throw CustomError.internalServer("Something went very wrong" );
        }
    }

    async getAllPendingRepairs() {
        try {
            const result = await Repairs.find({
                where: {
                    repairStatus: RepairsStatus.PENDING
                }
            })
            return result
        } catch (error) {
            throw CustomError.internalServer("Something went very wrong" );
        }
    }

    async getPendingRepairById(id: number) {
        try {
            const result = await Repairs.findOne({ where: { id } })
            if (!result || result.repairStatus !== RepairsStatus.PENDING) {
              throw CustomError.notFound("Repair not found or not pending");
            }
            return result
        } catch (error) {
            throw CustomError.internalServer("Something went very wrong" );
        }
    }

    async updatePendingRepair(id: number, repair: UpdateRepairsDto) {
        const updatedRepair = await this.getPendingRepairById(id)
        updatedRepair.repairStatus = repair.status
        try {
            const result = await updatedRepair.save()
            return result
        } catch (error) {
            throw CustomError.internalServer("Something went very wrong" );
        }
    }

    async cancelPendingRepair(id: number) {
        const repair = await this.getPendingRepairById(id)

        repair.repairStatus = RepairsStatus.CANCELLED

        try {
            await repair.save()
            return ("Repair cancelled")
        } catch (error) {    
            throw CustomError.internalServer("Something went very wrong" );
        }
    }

}
