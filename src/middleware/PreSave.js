async function preSave(next) {
  if (this.donationHistory.length > 0) {//
    const lastDonation = this.donationHistory[this.donationHistory.length - 1];
    lastDonation.donationDate = new Date();

    // Calcular a próxima data de doação com base no sexo do doador
    const nextDonationDelay = this.sex === 'M' ? 2 : 3;// Se o sexo for masculino, a próxima doação será em 2 meses. Se for feminino, será em 3 meses
    lastDonation.nextDonationDate = new Date(new Date().getTime() + nextDonationDelay * 30 * 24 * 60 * 60 * 1000);

    // Definir a data de validade para a doação
    lastDonation.expiryDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
  }

  next();
}

export default preSave; // Exporte a função preSave como padrão