import { Repository } from 'typeorm';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Zone } from './entities/zone.entity';
export declare class ZonesService {
    private readonly zoneRepository;
    constructor(zoneRepository: Repository<Zone>);
    create(createZoneDto: CreateZoneDto): Promise<Zone>;
    findAll(): Promise<Zone[]>;
    findOne(id: string): Promise<Zone>;
    update(id: string, updateZoneDto: UpdateZoneDto): Promise<Zone>;
    remove(id: string): Promise<Zone>;
}
