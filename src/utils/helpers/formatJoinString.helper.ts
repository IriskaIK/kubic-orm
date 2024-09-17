
export default function formatJoinStringHelper(input : string) : string{
    const parts = input.split('.');
    return `"${parts.join('"."')}"`;
}