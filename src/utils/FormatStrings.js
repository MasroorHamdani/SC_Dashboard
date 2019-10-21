export function capitalizeFirstLetter(string) {
    if (string) {
        string = string.trim();
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return string;
    }
}