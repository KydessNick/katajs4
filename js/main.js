class View {
    constructor(){
        this.app = document.getElementById('app');

        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'Github Search Repositories';

       

        this.searchContainer = this.createElement('div', 'search-container')

        this.searchInput     = this.createElement('input', 'search-input')
        this.searchInput.type ='search'

        this.suggestContainer = this.createElement('div', 'suggest-container')
        this.suggestList = this.createElement('ul', 'suggest-container__list')

        this.suggestContainer.append(this.suggestList)

        this.addedRepoContainer = this.createElement('div', 'added-repo')
        this.addedRepoList   = this.createElement('ul', 'added-repo__list')
        // this.addedRepoElem   = this.createElement('li', 'added-repo-item')

        // this.addedRepoList.append(this.addedRepoElem)

        this.addedRepoContainer.append(this.addedRepoList)
        
        this.searchContainer.append(this.searchInput)
        this.searchContainer.append(this.suggestContainer)

        this.app.append(this.title)
        this.app.append(this.searchContainer)
        this.app.append(this.addedRepoContainer)



    }

    createElement(elemTag, elemClass){
        const element = document.createElement(elemTag)

        if(elemClass){
            element.classList.add(elemClass)
        }
        return element
    }

    createSuggest(userData){
        const userElement = this.createElement('li', 'suggest-container__item')
        // userElement.addEventListener('click', () => this.addSuggest(userElement))
        userElement.addEventListener('click', () => this.addSuggest(userData))
        userElement.addEventListener('click', () => this.clearSggest())
        userElement.innerHTML = `<div>
                                    <p>Name repository: ${userData.name}</p>
                                    <p>Login: ${userData.owner.login}</p>
                                    <p>Stars: ${userData.stargazers_count}</p>
                                </div>
                                `;
        this.suggestList.append(userElement)
        console.log(userElement)
    }

    addSuggest(userData){
        const userSuggestElement = this.createElement('li', 'added-repo__item')
         userSuggestElement.innerHTML =`
                                 <div>
                                 <p>Name repository: ${userData.name}</p>
                                 <p>Login: ${userData.owner.login}</p> 
                                 <p>Stars: ${userData.stargazers_count}</p>
                                 </div> 
                                 <button class="delete-btn"><img src="/img/cross.svg" alt="cross image"></button>
                                 `
                            
    this.addedRepoList.append(userSuggestElement)
    
    let currentTasks = document.querySelectorAll(".delete-btn");
    for(let i=0; i<currentTasks.length; i++){
        currentTasks[i].addEventListener('click', function(){
          this.parentNode.remove();
        })
    }
    }

    clearSggest(){
        this.searchInput.value = '';
        this.suggestList.innerHTML ='';
    }


}


class Search{
    constructor(view){
       this.view = view

       this.view.searchInput.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 500) )
    }


   async searchUsers(){
    const searchValue = this.view.searchInput.value;
    // const IsSearchInputFocused = this.view.searchInput;
    if(searchValue){
        this.clearUsers();
        return await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5&page=1`)
        .then((res)=>{
            if(res.ok){
                res.json()
                // .then(res => console.log(res))
                .then((res) =>{
                    res.items.forEach(user => {
                        this.view.createSuggest(user)
                    });
                })
            }
        })
    } else this.clearUsers();
       
    }


    loadUser(login){
        // const userEl = this.
    }

    clearUsers(){
        this.view.suggestList.innerHTML = '';
    }

    debounce(fn, delay){
        let timeOut;

        return function(){
            const fncall = ()=> fn.call(this, arguments)
            
            clearTimeout(timeOut)

            timeOut = setTimeout(fncall, delay)
        }
    }

    // const debounce = (fn, debounceTime) => {
    //     //code here
    //     let timeOut
    
    //     return function(){
    //         const fnCall=() =>{fn.apply(this, arguments)}
    
    //         clearTimeout(timeOut)
    
    //         timeOut = setTimeout(fnCall, debounceTime)
    //     }
    // }

}

new Search(new View())