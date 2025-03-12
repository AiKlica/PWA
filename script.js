const firebaseConfig = {
    apiKey: "AIzaSyCHTaBXzJUdwRKtUNL99t1Uc6LXaRYuGZw",
    authDomain: "temp-e-humid.firebaseapp.com",
    databaseURL: "https://temp-e-humid-default-rtdb.firebaseio.com/",
    projectId: "temp-e-humid",
    storageBucket: "temp-e-humid.firebasestorage.app",
    messagingSenderId: "839701424439",
    appId: "1:839701424439:web:cea4e8876b66c42060d2b2",
    measurementId: "G-HC0ZCE849X"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const dadosRef = database.ref('SensorTemp/Dados');
const auth = firebase.auth();

const form = document.getElementById("loginForm");
var home = document.getElementsByClassName("home");
var login = document.getElementsByClassName("login");
const registrar = document.getElementById("registrar");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    auth.signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuário logado com sucesso", user);
            alert("Login bem sucedido!");
            display();
        })
        .catch((error) => {
            const codErro = error.code;
            const mensagemErro = error.message;
            console.error("Erro ao fazer login: ", codErro, mensagemErro);
            alert("Erro ao fazer login: " + mensagemErro);
        });
});

function display() {
    if (login.length > 0 && home.length > 0) {
        login[0].style.display = "none";
        home[0].style.display = "block";
    }
}

registrar.addEventListener("click", function () {
    registrar.disabled = "true";
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    auth.createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuário registrado com sucesso", user);
            alert("Usuário registrado!");
            display();
        })
        .catch((error) => {
            const codErro = error.code;
            const mensagemErro = error.message;
            console.error("Erro ao registrar: ", codErro, mensagemErro);
            alert("Erro ao registrar: " + mensagemErro);
        })
        .finally(() => {
            registrar.disabled = false;
        });
});

esqueci.addEventListener("click", function () {
    esqueci.disabled = "true";
    const email = document.getElementById("email").value;

    auth.sendPasswordResetEmail(email)
        .then(() => {
            console.log("E-mail de redefinição de senha enviado!");
            alert("E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Erro ao enviar e-mail de redefinição de senha:", errorCode, errorMessage);
            alert("Erro: " + errorMessage);
        })
        .finally(() => { 
            esqueci.disabled = "false";
        });
});

dadosRef.once('value', function (snapshot) {
    const dados = snapshot.val();

    var xyValues = [];
    var labels = [];

    for (const key in dados) {
        if (dados.hasOwnProperty(key)) {
            const info = dados[key].split(' / ');
            const te = moment(info[0].replace('Data ', '').trim(), "DD/MM/YY HH:mm:ss").toString();
            const tt = te.split(" ");
            //const hm = tt[4].split(":");
            const tempoTotal = `${tt[2]}-${tt[1]} ${tt[4]}`; //const tempoTotal = `${tt[2]}-${tt[1]}-${tt[3]} ${hm[0]}:${hm[1]}`;
            const temperatura = parseFloat(info[2].replace('Temperatura: ', '').replace('°C', ''));

            xyValues.push({
                y: temperatura,
                x: tempoTotal
            });
            labels.push(tempoTotal);
        }
    }
    labels = labels.slice(0, 50);

    new Chart("myChart", {
        type: "scatter",
        data: {
            datasets: [{
                pointRadius: 4.5,
                pointBackgroundColor: "rgba(23, 16, 97, 1)",
                data: xyValues
            }]
        },
        options: {
            legend: { display: false },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return `${tooltipItem.xLabel} - Temperatura: ${tooltipItem.yLabel}°C`;
                    }
                }
            },
            scales: {
                xAxes: [{
                    type: 'category',
                    labels: labels,
                    ticks: {
                        maxTicksLimit: 10,
                        maxRotation: 0,
                        autoSkip: true,
                    }
                }]
            },
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 40,
                }
            }]
        }
    })
});
