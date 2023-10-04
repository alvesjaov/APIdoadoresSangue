function ValidateCPF(strCPF) {
  let Sum;
  let rest;
  Sum = 0;
// Se o CPF for "00000000000", ele não é válido
if (strCPF == "00000000000") return false;

// Calcula o primeiro dígito
for (let i = 1; i <= 9; i++) Sum = Sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
rest = (Sum * 10) % 11;

  if ((rest == 10) || (rest == 11))  rest = 0;
  if (rest != parseInt(strCPF.substring(9, 10)) ) return false;

Sum = 0;
// Calcula o segundo dígito
  for (let i = 1; i <= 10; i++) Sum = Sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  rest = (Sum * 10) % 11;

  if ((rest == 10) || (rest == 11))  rest = 0;
  // Se o resto calculado corresponder ao segundo dígito, o CPF é válido
  return rest == parseInt(strCPF.substring(10, 11) );
}

export default ValidateCPF;