export function capitalizeFirstLetter(string) {
    string = string.trim();
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return string;
    }
}