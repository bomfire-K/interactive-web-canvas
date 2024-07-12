export const randomNumBetween = (min, max) =>{
    return Math.random() * (max-min) + min
}
//화면 크기에 따른 빗변의 길이
export const hypotenuse = (x, y) => {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
