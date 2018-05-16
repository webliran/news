function addElement (data) { 
  let sharedMomentsArea = document.querySelector('.main');

  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'card';


  let image = document.createElement("img");
  image.className = 'card-img-top';
  image.src = data.urlToImage;
 // cardWrapper.appendChild(image);


  let cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  cardWrapper.appendChild(cardBody);

  let dateString = new Date(data.publishedAt).toLocaleDateString();

  let cardDateTextElement = document.createElement('p');
  cardDateTextElement.className = 'card-date';
  cardDateTextElement.textContent = dateString;
  cardBody.appendChild(cardDateTextElement);

  let cardTitleTextElement = document.createElement('h5');
  cardTitleTextElement.className = 'card-title';
  cardTitleTextElement.textContent = data.title;
  cardBody.appendChild(cardTitleTextElement);


  let cardTextElement = document.createElement('p');
  cardTextElement.className = 'card-text';
  cardTextElement.textContent = data.description;
  cardBody.appendChild(cardTextElement);

  
  let cardSourceTextElement = document.createElement('p');
  cardSourceTextElement.className = 'card-date';
  cardSourceTextElement.textContent = data.source.name;
  cardBody.appendChild(cardSourceTextElement);

  sharedMomentsArea.appendChild(cardWrapper);

  }

  export default addElement;