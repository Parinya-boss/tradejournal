import { isNumber } from "@nestjs/common/internal";

export function validateEnvironment(config: Record<string, unknown>): Record<string, unknown> {
    const validated = { ...config }

    for(const key of ['PORT', 'DB_PORT']){
        const raw = config[key];

        if(typeof raw !== 'string' || raw.trim() === ''){
            throw new Error(`${key} ต้องมีข้อความ`)
        }

        const value = Number(raw)
        if(!Number.isInteger(value) || value < 1 || value > 65535){
            throw new Error(`${key} ต้องเป็นจำนวนเต็ม และมีค่ามากกว่า 1 และน้อยกว่า 65535`)
        }

        validated[key] = value;
    }

    for(const key of ['DB_DATABASE', 'DB_USERNAME']){
        const raw = config[key];

        if(typeof raw !== 'string' || raw.trim() === ''){
            throw new Error(`${key} ต้องมีข้อความ`)
        }
    }

    if(typeof config.DB_PASSWORD !== 'string') {
        throw new Error('ต้องกำหนด Password และอนุญาตให้เป็นค่าว่าง')
    }

    return validated;
}