import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
export declare class ZonesController {
    private readonly zonesService;
    constructor(zonesService: ZonesService);
    create(createZoneDto: CreateZoneDto): Promise<import("./entities/zone.entity").Zone>;
    findAll(): Promise<import("./entities/zone.entity").Zone[]>;
    findOne(id: string): Promise<import("./entities/zone.entity").Zone>;
    update(id: string, updateZoneDto: UpdateZoneDto): Promise<import("./entities/zone.entity").Zone>;
    remove(id: string): Promise<import("./entities/zone.entity").Zone>;
}
