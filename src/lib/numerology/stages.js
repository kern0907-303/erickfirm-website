// 五大階段數（需要出生時分）。艾瑞克彩虹生命數字系統：年、月、日、時、分各自逐位加成小計，
// 由老年往幼年累加：老年＝年；中年＝年＋月；青年＝年＋月＋日（等於主命數）；青少年＝再加時；幼年＝再加分。
const digitSum = (value) => String(value).split('').reduce((total, digit) => total + Number(digit), 0);

export function chainOfSum(sum) {
  const steps = [sum];
  let current = sum;
  while (current > 9) {
    current = digitSum(current);
    steps.push(current);
  }
  const first = String(steps[0]).padStart(2, '0');
  return [first, ...(steps.length > 1 ? steps.slice(1) : [steps[0]]).map(String)];
}

/** parts：{ year, month, day }；time：'HH:MM'。回傳五個階段的數字路徑（字串陣列，例 ['19','10','1']）。 */
export function lifeStages(parts, time) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(time || '').trim());
  if (!parts || !match) return null;
  const year = digitSum(String(parts.year).padStart(4, '0'));
  const month = digitSum(String(parts.month).padStart(2, '0'));
  const day = digitSum(String(parts.day).padStart(2, '0'));
  const hour = digitSum(match[1].padStart(2, '0'));
  const minute = digitSum(match[2]);
  return {
    elder: chainOfSum(year),
    middle: chainOfSum(year + month),
    young: chainOfSum(year + month + day),
    teen: chainOfSum(year + month + day + hour),
    child: chainOfSum(year + month + day + hour + minute),
  };
}
