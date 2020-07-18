const form = document.querySelector('.hook-form')
const textArea = document.querySelector('.json')
const confirmation = document.querySelector('.confirmation')
textArea.style.visibility = 'hidden'

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const username = formData.get('username')
    const avatar_url = formData.get('avatar')
    const content = formData.get('content')
    const API_URL = formData.get('webhook_url')
    const resetForm = formData.get('resetForm')
    if(resetForm){
        form.reset()
    }
    const body = {
        username,
        avatar_url,
        content
    }
    fetch(API_URL + '?wait=1', {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json'
        }
    })
        .then(async (response) => {
            const obj = await response.json()
            if(response.status === 200) {
                const str = JSON.stringify(obj, null, 4);
                confirmation.innerHTML = `<h3>Success</h3>`
                textArea.style.visibility = 'visible'
                textArea.innerHTML = str
                hljs.highlightBlock(textArea)
            }
        })
})
