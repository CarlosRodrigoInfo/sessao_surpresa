class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList = document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this);
    }

    animateLinks() {
        this.navLinks.forEach((link, index) => {
            link.style.animation
                ? (link.style.animation = "")
                : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`);
        });
    }

    handleClick() {
        this.navList.classList.toggle(this.activeClass);
        this.animateLinks();
    }

    addClickEvent() {
        this.mobileMenu.addEventListener("click", this.handleClick);
    }

    init() {
        if (this.mobileMenu) {
            this.addClickEvent();
        }
        return this;
    }
}

const mobileNavbar = new MobileNavbar(
    "#burger",
    ".nav-list",
    ".nav-list li",
);
mobileNavbar.init();

const isAuthenticated = true; // Defina isso com base na autenticação do usuário

if (isAuthenticated) {
  const profileButton = document.querySelector(".profile-btn");
  profileButton.style.display = "inline-block"; // Mostrar o botão de perfil
}

const apiKey = '3ec3e5d091f9c442dc0688774f5594c4';
const baseUrl = 'https://api.themoviedb.org/3';

let maxTentativas = 25; // Defina o número máximo de tentativas
let tentativas = 0; // Inicialize o contador de tentativas
let currentPage = Math.floor(Math.random() * 1000) + 1; // Gere um número aleatório entre 1 e 10 para a página

// Função para buscar filmes ou séries aleatórias com base nos filtros
function getRandomMedia() {
  // Obtenha os valores dos filtros do formulário
  const category = document.getElementById('cat').value;
  const mediaType = document.getElementById('mv').value;
  const rating = '6.0'; // Avaliação fixa (você pode alterar conforme necessário)

  // Defina o tipo de mídia com base na seleção
  let searchMediaType;
  if (mediaType === 'filme') {
    searchMediaType = 'movie';
  } else if (mediaType === 'serie') {
    searchMediaType = 'tv';
  } else {
    // Se a seleção não for válida, interrompa a função
    console.error('Tipo de mídia inválido.');
    return;
  }

  // Verifique se a categoria é "todas" e construa a URL da solicitação de acordo
  let url;
  if (category === 'todas') {
    url = `${baseUrl}/${searchMediaType}/popular?api_key=${apiKey}&language=pt-BR&page=${currentPage}`;
  } else {
    // Caso contrário, inclua o parâmetro de gênero (category) na URL
    url = `${baseUrl}/discover/${searchMediaType}?api_key=${apiKey}&vote_average.gte=${rating}&with_genres=${category}&language=pt-BR&page=${currentPage}`;
  }

  axios.get(url)
    .then(response => {
      const media = response.data.results;

      // Verifique se a variável media é definida e se possui algum resultado
      if (media && media.length > 0) {
        // Resto do seu código aqui
        const randomIndex = Math.floor(Math.random() * media.length);
        const selectedMedia = media[randomIndex];

        // Exiba a capa da mídia, o título, a sinopse e a avaliação na div 'media-info'
        const posterPath = selectedMedia.poster_path;
        const title = searchMediaType === 'movie' ? selectedMedia.title : selectedMedia.name;
        const overview = selectedMedia.overview;

        const mediaInfoDiv = document.getElementById('media-info');
        mediaInfoDiv.innerHTML = '';

        if (posterPath) {
          const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
          const posterImg = document.createElement('img');
          posterImg.src = posterUrl;
          mediaInfoDiv.appendChild(posterImg);
        }

        const titleElem = document.createElement('h2');
        titleElem.textContent = title;
        mediaInfoDiv.appendChild(titleElem);

        const overviewElem = document.createElement('p');
        overviewElem.textContent = overview;
        mediaInfoDiv.appendChild(overviewElem);
      } else {
        // Trate o caso em que não há mídia encontrada
        if (tentativas < maxTentativas) {
          tentativas++; // Incrementa o contador de tentativas
          // Tente a próxima página se houver mais páginas disponíveis
          if (currentPage < response.data.total_pages) {
            currentPage++;
            getRandomMedia();
          } else {
            // Se não houver mais páginas, exiba uma mensagem de erro
            document.getElementById('media-info').textContent = 'Nenhuma mídia encontrada após várias tentativas.';
          }
        } else {
          // Se o limite de tentativas foi atingido, exiba uma mensagem de erro
          document.getElementById('media-info').textContent = 'Nenhuma mídia encontrada após várias tentativas.';
        }
      }
    })
    .catch(error => {
      console.error('Erro ao buscar mídia:', error);
    });
}

// Event listener para o formulário de pesquisa
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('filtro-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    tentativas = 0; // Zera o contador de tentativas ao enviar o formulário
    currentPage = Math.floor(Math.random() * 10) + 1; // Gere um número aleatório entre 1 e 10 para a página ao enviar o formulário
    getRandomMedia();
  });
});
