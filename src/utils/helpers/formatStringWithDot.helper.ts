
export default function formatStringWithDot(input : string) : string{
    const parts = input.split('.');
    parts.forEach((part, index) => {
        if(part.includes('=')){
            parts[index] = part.split('=').map(e=>e.trim()).join('" = "')
        }
    })
    return `"${parts.join('"."')}"`;
}


