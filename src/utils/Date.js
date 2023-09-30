// Função para formatar a data no padrão brasileiro
function formatDate(date) {
    // Pega o dia do objeto date, converte para string e adiciona um zero à esquerda se for um único dígito
    const day = date.getDate().toString().padStart(2, '0');
    
    // Pega o mês do objeto date (começando de 0), adiciona 1 (para corrigir a contagem a partir de 0), converte para string e adiciona um zero à esquerda se for um único dígito
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Pega o ano do objeto date
    const year = date.getFullYear();
    
    // Retorna uma string formatada com dia, mês e ano separados por barras
    return `${day}/${month}/${year}`;
}

// Exporta a função para que possa ser usada em outros arquivos JavaScript

export default formatDate;