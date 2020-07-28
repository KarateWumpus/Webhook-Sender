const form = document.querySelector('.hook-form')
const textArea = document.querySelector('.json')
const themeButton = document.querySelector('.themeButton')
const themeSwitch = document.querySelector('.themeSwitch')
const embed = document.querySelector('.embed')
const embedDesc = document.querySelector('#embed-description')
const addEmbedSwitch = document.querySelector('.addEmbed')
const confirmation = document.querySelector('.confirmation')
const allowedURLS = ['canary.discord.com', 'ptb.discord.com', 'discord.com', 'canary.discordapp.com', 'ptb.discordapp.com', 'discordapp.com']
textArea.style.visibility = 'hidden'

form.addEventListener('submit', (event) => {
    event.preventDefault()
    textArea.style.visibility = 'hidden'
    const formData = new FormData(form)
    const username = formData.get('username')
    const avatar_url = formData.get('avatar')
    const content = formData.get('content')
    const API_URL = formData.get('webhook_url')
    const resetForm = formData.get('resetForm')
    let embeds
    if(!embed.hidden) {
        const title = formData.get('title')
        const description = formData.get('description')
        const color = parseInt(formData.get('color').substring(1), 16)
        const author = formData.get('author')
        const author_url = formData.get('author_url')
        const author_icon = formData.get('author_icon')
        const footer = formData.get('footer')
        const footer_icon = formData.get('footer_icon')
        const url = formData.get('url')
        const image_url = formData.get('image_url')
        const thumbnail_url = formData.get('thumbnail_url')
        embeds = [
            {
                title,
                description,
                url,
                color,
                'author': {
                    'name': author,
                    'url': author_url,
                    'icon_url': author_icon
                },
                'footer': {
                    'text': footer,
                    'icon_url': footer_icon
                },
                'image': {
                    'url': image_url
                },
                'thumbnail': {
                    'url': thumbnail_url
                }
            }
        ]
    }
    const body = {
        username,
        avatar_url,
        content,
        embeds
    }
    const checkURL = new URL(API_URL)
    const checkPathname = checkURL.pathname.split('/')
    if (!allowedURLS.includes(checkURL.host)) {
        confirmation.innerHTML = '<h3>Error: Not a valid webhook URL</h3>'
        return
    } else if (checkPathname[1] + checkPathname[2] !== 'apiwebhooks') {
        confirmation.innerHTML = '<h3>Error: Not a valid webhook URL</h3>'
        return
    } else if (!Number.isInteger(+checkPathname[3])) {
        confirmation.innerHTML = '<h3>Error: Not a valid webhook URL</h3>'
        return
    }
    fetch(API_URL + '?wait=1', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json'
        }
    })
        .then(async (response) => {
            const obj = await response.json()
            if (response.status === 200) {
                const str = JSON.stringify(obj, null, 4)
                confirmation.innerHTML = '<h3 class="title">Success</h3>'
                textArea.style.visibility = 'visible'
                textArea.innerHTML = str
                hljs.highlightBlock(textArea)
                if (resetForm) {
                    form.reset()
                }
            } else {
                confirmation.innerHTML = `<h3>Error ${response.status}</h3>`
                const str = JSON.stringify(obj, null, 4)
                textArea.style.visibility = 'visible'
                textArea.innerHTML = str
                hljs.highlightBlock(textArea)
            }
        })
})

themeButton.addEventListener('click', (event) => {
    if(themeSwitch.href === `${window.location}dark.css`) {
        themeSwitch.href = 'light.css'
        themeButton.src = 'images/moon.png'
    } else {
        themeSwitch.href = 'dark.css'
        themeButton.src = 'images/sun.png'
    }
})

addEmbedSwitch.addEventListener('click', (event) => {
    if(embed.hidden) {
        embed.hidden = false
        embedDesc.required = true
    } else {
        embed.hidden = true
        embedDesc.required = false
    }
})