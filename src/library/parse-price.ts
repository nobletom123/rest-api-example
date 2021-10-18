export const parsePrice = (price: number): number => {
  const stringPrice = price.toString();
  let finalPrice: number;

  if (stringPrice.includes(".")) {
    const [postDot = "0", preDot] = stringPrice.split(".");

    const postDotNumber = Number.parseInt(postDot, 10) * 100;
    let preDotNumber = 0;

    if (preDot.length > 1) {
      preDotNumber = Number.parseInt(preDot.substring(0, 2), 10);
    } else if (preDot.length === 1) {
      preDotNumber = Number.parseInt(`${preDot}0`, 10);
    }

    finalPrice = postDotNumber + preDotNumber;
  } else {
    finalPrice = price * 100;
  }

  return finalPrice;
};
