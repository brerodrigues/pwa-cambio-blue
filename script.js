document.addEventListener("DOMContentLoaded", () => {
    const exchangeRateInput = document.getElementById("exchangeRate");
    const pesoValueInput = document.getElementById("pesoValue");
    const realValueInput = document.getElementById("realValue");

    // Inicializar Cleave.js para formatação
    const cleaveExchangeRate = new Cleave(exchangeRateInput, {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
        numeralDecimalMark: ",",
        delimiter: ".",
    });

    const cleavePesoValue = new Cleave(pesoValueInput, {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
        numeralDecimalMark: ",",
        delimiter: ".",
        prefix: "ARS ", // Prefixo para Peso
        noImmediatePrefix: true,
        rawValueTrimPrefix: true,
    });

    const cleaveRealValue = new Cleave(realValueInput, {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
        numeralDecimalMark: ",",
        delimiter: ".",
        prefix: "R$ ", // Prefixo para Real
        noImmediatePrefix: true,
        rawValueTrimPrefix: true,
    });

    // Carregar o valor do câmbio salvo do localStorage
    const savedExchangeRate = localStorage.getItem("exchangeRate");
    if (savedExchangeRate) {
        cleaveExchangeRate.setRawValue(savedExchangeRate);
    }

    // Função para atualizar os valores com base no câmbio
    const updateValues = () => {
        const exchangeRate = parseFloat(cleaveExchangeRate.getRawValue());
        const pesoValue = parseFloat(cleavePesoValue.getRawValue());
        const realValue = parseFloat(cleaveRealValue.getRawValue());

        if (!isNaN(exchangeRate) && !isNaN(pesoValue)) {
            cleaveRealValue.setRawValue((pesoValue / exchangeRate).toFixed(2));
        }

        if (!isNaN(exchangeRate) && !isNaN(realValue)) {
            cleavePesoValue.setRawValue((realValue * exchangeRate).toFixed(2));
        }
    };

    // Salvar o valor do câmbio no localStorage
    exchangeRateInput.addEventListener("change", () => {
        localStorage.setItem("exchangeRate", cleaveExchangeRate.getRawValue());
        updateValues();
    });

    pesoValueInput.addEventListener("input", () => {
        const exchangeRate = parseFloat(cleaveExchangeRate.getRawValue());
        const pesoValue = parseFloat(cleavePesoValue.getRawValue());
        if (!isNaN(exchangeRate) && !isNaN(pesoValue)) {
            cleaveRealValue.setRawValue((pesoValue / exchangeRate).toFixed(2));
        }
    });

    realValueInput.addEventListener("input", () => {
        const exchangeRate = parseFloat(cleaveExchangeRate.getRawValue());
        const realValue = parseFloat(cleaveRealValue.getRawValue());
        if (!isNaN(exchangeRate) && !isNaN(realValue)) {
            cleavePesoValue.setRawValue((realValue * exchangeRate).toFixed(2));
        }
    });
});

// Registrar o service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/pwa-cambio-blue/service-worker.js")
            .then((registration) => console.log("ServiceWorker registrado com sucesso:", registration))
            .catch((error) => console.log("Falha ao registrar o ServiceWorker:", error));
    });
}
