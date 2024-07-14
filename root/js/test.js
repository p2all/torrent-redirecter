

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);

const submit = (el, e) => {
    document.querySelectorAll('.quality').forEach(element => {
        element.classList.add('disabled')
    })
    let url = el?.getAttribute('url');
    el?.classList.remove("disabled");
    if (e) {
        url = e;
    }
    const separator = params.get('callback').includes('?') ? '&' : '?';
    if (params.get('target') == 'blank') {
        window.open(`${params.get('callback')}${separator}${params.get('callback_paramater')}=${url}`, '_blank');
    } else {
        window.location.assign(`${params.get('callback')}${separator}${params.get('callback_paramater')}=${url}`);
    }
}

function calculateTorrentHealth(seeds, peers) {
    if (seeds <= 0) {
        return 'd'; // dead
    }

    if (peers === undefined || peers === null) {
        if (seeds > 100) {
            return 'a'; // fast
        } else if (seeds > 50) {
            return 'b'; // medium
        } else if (seeds > 5) {
            return 'c'; // slow
        } else {
            return 'd'; // very slow
        }
    } else {
        if (seeds > 100) {
            if (peers > 100) {
                return 'a'; // fast
            } else if (peers > 50) {
                return 'b'; // medium
            } else if (peers > 5) {
                return 'c'; // slow
            } else {
                return 'd'; // very slow
            }
        } else if (seeds > 50) {
            if (peers > 50) {
                return 'b'; // medium
            } else if (peers > 5) {
                return 'c'; // slow
            } else {
                return 'd'; // very slow
            }
        } else if (seeds > 5) {
            if (peers > 5) {
                return 'c'; // slow
            } else {
                return 'd'; // very slow
            }
        } else {
            return 'd'; // very slow
        }
    }
}


const fetchYTS = (response) => {
    const data = response.data;
    document.querySelector('.name span').innerText = data.movie?.title_long;
    document.querySelector('.movie-background').style.setProperty('background-image', `url(${data.movie?.background_image})`);
    document.querySelector('.poster').style.setProperty('background-image', `url(${data.movie?.medium_cover_image})`);
    let torrents = ``;
    data.movie.torrents?.forEach(el => {
        console.log(el)
        console.log(calculateTorrentHealth(el.seeds, el.peers))
        torrents += `<div seeds="${el.seeds}" seeds="${el.peers}" rsa="${findResolution(el.quality)}" class="quality a" url="${el.url}" onclick="submit(this)"><span>${el.quality} ${el.type}<p>${el.video_codec}</p></span><a>${parseInt(el.size?.split(' ')[0]).toFixed(2)} ${el.size?.split(' ')[1]}</a></div>`;
        globalCount++;
    });
    let html = `<div class="container-provider">
                <!--<a href="${data.movie.url}" target="_blank"><div class="logo-source yts"></div></a>-->
                <div class="devided-section yts-section">${torrents}</div>
    </div>`
    document.querySelector('.qualities-find').insertAdjacentHTML('afterbegin', html);
    document.querySelector('.name a').innerText = 'Verified from YTS'
}

function parseSize(sizeString) {
    let sizeInBytes = parseInt(sizeString);
    if (isNaN(sizeInBytes)) {
        throw new Error("Invalid size string");
    }

    const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];

    let i = 0;
    while (sizeInBytes >= 1024 && i < units.length - 1) {
        sizeInBytes /= 1024;
        i++;
    }

    return sizeInBytes.toFixed(2) + " " + units[i];
}

const allTypes = document.querySelectorAll('.sections span');
allTypes.forEach(element => {
    element.addEventListener('click', function () {
        allTypes.forEach(el => { el.classList.remove('selected') })
        this.classList.add('selected')
        document.querySelector('.qualities-find').setAttribute('rsa', this.getAttribute('rsa'));
        document.querySelectorAll('.container-provider').forEach(parent => {
            parent.classList.remove('hidden')
            if (this.getAttribute('rsa') == 'mixed') {
                return
            }
            if (parent.querySelectorAll('.quality[rsa="' + this.getAttribute('rsa') + '"]').length == 0) {
                parent.classList.add('hidden');
            }
        })
    })
})

let globalCount = 0;

const fetchTorrents = (data, e, url) => {
    let torrents = ``;
    data.forEach(torrent => {
        if (torrent.info_hash !== '0000000000000000000000000000000000000000') {
            try {
                torrents += `<div slug="${encodeURIComponent(torrent.slug)}" seeds="${torrent.seeders}" peers="${torrent.leechers}" rsa="${findResolution(torrent.name)}" class="quality ${calculateTorrentHealth(torrent.type == '1337x' ? torrent.seeders : torrent.seeders, torrent.type == '1337x' ? null : torrent.leechers)}" url="${torrent.info_hash}" onclick="${torrent.type == '1337x' ? 'extract(this)' : 'submit(this)'}"><span>${torrent.name}<p></p></span><a>${torrent.type == '1337x' ? torrent.sizeText : parseSize(torrent.size)}</a></div>`;
            } catch (e) {
                console.log(e)
            }
            globalCount++;
        }
    })
    if (torrents == '') {
        return;
    }
    findHash();
    let html = ` <div class="container-provider">
            <a href="${url}" target="_blank"><div class="logo-source ${e}"></div></a>
            <div class="devided-section">
               ${torrents}
            </div>
        </div>`;
    document.querySelector('.other-qualities').insertAdjacentHTML('beforeend', html);
}

async function extract(el) {
    document.querySelectorAll('.quality').forEach(element => {
        element.classList.add('disabled')
    })
    el?.classList.remove("disabled");
    el.classList.add('loading');
    el.insertAdjacentHTML('afterbegin', '<div class="loader"></div>')
    const data = await fetch(`/scrape/extract?slug=${el.getAttribute('slug')}&type=1337x`).then(response => {
        return response.json();
    }).then(data => {
        return data;
    }).catch(error => {
        return (error)
    })
    if (data.magnate || data.hash) {
        console.log(data.magnate || data.hash)
        submit(el, data.magnate || data.hash)
    }
}

function formatSeasonEpisode(season, episode) {
    // Ensure season and episode are numbers and pad them with leading zeros if necessary
    const seasonStr = String(season).padStart(2, '0');
    const episodeStr = String(episode).padStart(2, '0');

    // Format the string as SXXEXX
    return `S${seasonStr}E${episodeStr}`;
}

function getInfo(text) {
    const codec = findCodec(text);
    const resolution = findResolution(text);

    return {
        codec: codec,
        resolution: resolution
    };
}

function findCodec(text) {
    const codecPatterns = [
        { pattern: /x264/i, codec: 'x264' },
        { pattern: /h\.?264/i, codec: 'H.264' },
        { pattern: /h\.?265/i, codec: 'H.265' },
        { pattern: /hevc/i, codec: 'HEVC' },
        { pattern: /aac/i, codec: 'AAC' },
        { pattern: /ddp5\.?1/i, codec: 'DDP5.1' },
        { pattern: /xvid/i, codec: 'XviD' },
        { pattern: /10bit/i, codec: '10bit' },
        { pattern: /divx/i, codec: 'DivX' }
    ];

    for (let { pattern, codec } of codecPatterns) {
        if (pattern.test(text)) {
            return codec;
        }
    }
    return 'Unknown';
}

function findResolution(text) {
    const resolutionPatterns = [
        { pattern: /2160p/i, resolution: '2160p' },
        { pattern: /1080p/i, resolution: '1080p' },
        { pattern: /720p/i, resolution: '720p' },
        { pattern: /480p/i, resolution: '480p' },
        { pattern: /360p/i, resolution: '360p' },
        { pattern: /4k/i, resolution: '2160p' }
    ];

    for (let { pattern, resolution } of resolutionPatterns) {
        if (pattern.test(text)) {
            return resolution;
        }
    }
    return 'mixed';
}

let q;

if (params.get('type') == 'movie') {
    q = params.get('title') + ' ' + (params.get('year') || '')
} else {
    q = `${params.get('title')} ${(params.get('season') && params.get('episode') ? formatSeasonEpisode(params.get('season'), params.get('episode')) : '')}`;
}

function proxyFetch(slug, type = 'TV', url) {
    return new Promise((resolve, reject) => {
        if (!url) {
            url = `https://p2all.pro/scrape?url=${encodeURIComponent(`https://1337x.to/category-search/${slug}/${type}/1/`)}`
        }
        fetch(url).then(response => {
            return response.json();
        }).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error)
        })
    });
}

function proxyCros(url) {
    return new Promise((resolve, reject) => {
        fetch(`https://p2all.pro/scrape/cros?url=${encodeURIComponent(url)}`).then(response => {
            return response.json();
        }).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error)
        })
    });
}

if (params.get('poster')) {
    document.querySelector('.poster').style.backgroundImage = `url(${params.get('poster')})`
}

if (params.get('background')) {
    document.querySelector('.movie-background').style.backgroundImage = `url(${params.get('background')})`
}

if (params.get('type') == 'series') {
    document.querySelector('.yts').innerText = `Season ${params.get('season')} Episode ${params.get('episode')}`
}
if (params.get('name')) {
    document.querySelector('.name span').innerText = params.get('name')
}

let hashed = true;

function findHash() {
    document.querySelector('.body-json').classList.remove('hidden');
}

async function alogrithm() {
    if (params.get('type') == 'movie') {
        try {
            const response = await fetch(`https://yts.mx/api/v2/movie_details.json?imdb_id=${params.get('imdb')}&with_images=true`);
            const data = await response.json();
            fetchYTS(data);
            q = (data.data.movie.title_long)
            if (data.data.movie.torrents) {
                findHash();
            } else {

            }
        } catch (error) {
            console.error(error);
        }
    }
    if (q) {
        console.log(q)

        // 201">Movies
        // 202">Movies DVDR
        // 203">Music videos
        // 204">Movie clips
        // 205">TV shows
        // 206">Handheld
        // 207">HD - Movies
        // 208">HD - TV shows
        // 209">3D
        // 210">CAM/TS
        // 211">UHD/4k - Movies
        // 212">UHD/4k - TV shows
        // 299">Other

        function getURL(type) {
            return encodeURIComponent('https://apibay.org/q.php?q=' + q + (type ? '&cat=' + type : ''))
        }

        const code = params.get('type') == 'movie' ? 207 : 208;
        const nextcode = params.get('type') == 'movie' ? 201 : 205;

        let json;
        let other = `<div class="other-qualities">
        <div class="search-for-it">
            <input type="search" placeholder="Search for source"><a></a>
        </div>
        </div>`;
        document.querySelector('.qualities-find').insertAdjacentHTML('beforeend', other)
        if (params.get('name') == '') {
            return;
        }
        json = await proxyFetch(q, params.get('type') == 'series' ? 'TV' : 'Movies')
        fetchTorrents(json, 'xx', `https://1337x.to/category-search/${q}/${params.get('type') == 'series' ? 'TV' : 'Movies'}/1/`);
        json = await proxyCros(getURL(code))
        fetchTorrents(json, 'pp');
        json = await proxyCros(getURL(nextcode))
        fetchTorrents(json, 'pp');

        if (globalCount == 0) {
            // q = params.get('title')
            // console.log(q)
            // json = await proxyFetch(q, params.get('type') == 'series' ? 'TV' : 'Movies', `https://p2all.pro/scrape?url=${encodeURIComponent(`https://1337x.to/search/${q}/1/`)}`)
            // fetchTorrents(json, 'xx', `https://1337x.to/search/${q}/1/`);
        }
        if (q !== 'null') {
            document.querySelector('.search-for-it input').value = q;
        }
        document.querySelector('.loader').style.opacity = 0;
        document.querySelector('.loader-container a').innerText = 'End of results';

    } else {
        console.log('error');
    }
}
alogrithm();
