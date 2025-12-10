// gør første bogstav stort og alt andet smådt og fjerner _
export function getDisplayName(value) {

    let displayName = value.toLowerCase().split("_").join(" ");

    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    return displayName;

}