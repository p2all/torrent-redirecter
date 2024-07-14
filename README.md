# P2All Torrent Redirector

Welcome to P2All Torrent Redirector! This project provides a powerful API that allows users to search for torrents from popular sites like YTS, 1337x, and more, and then redirect users to your specified callback URL with the torrent information.

## Features

- **Scrape and retrieve torrent hashes** from various torrent sites.
- **Dynamic redirection** to user-defined URLs with torrent information.
- **Support for movies and TV series** with detailed parameters.
- **Customizable redirection behavior** with multiple optional parameters.

## Usage

To use the P2All Torrent Redirector, you need to make a GET request to the `/find/` endpoint with the appropriate query parameters.

### Base URL

https://p2all.pro/find/


### Required Parameters

- `imdb`: The IMDb ID of the movie or series.
- `type`: The type of content (`movie` or `series`).
- `name`: The name of the movie or series.
- `callback`: The URL to which the user will be redirected after choosing the torrent quality.
- `callback_paramater`: The parameter in the callback URL that will receive the torrent hash.

### Optional Parameters

- `title`: The title of the specific episode (for series) or the movie.
- `season`: The season number (for series).
- `episode`: The episode number (for series).
- `background`: The URL of the background image.
- `poster`: The URL of the poster image.
- `target`: If set to `_blank`, the redirection will open in a new window.

### Example

#### Movie

```
https://p2all.pro/find/?imdb=tt23289160&type=movie&tmdb=940721&name=Godzilla%20Minus%20One&callback=https%3A%2F%2Fwww.google.com%2Fsearch&callback_paramater=q
```

In this example:
- `imdb=tt23289160`: IMDb ID of the movie "Godzilla Minus One".
- `type=movie`: Type is movie.
- `name=Godzilla Minus One`: Name of the movie.
- `callback=https://www.google.com/search`: URL to redirect the user to Google search after choosing the torrent quality.
- `callback_paramater=q`: The torrent hash will be passed as the `q` parameter in the callback URL (i.e., it will search for the torrent hash on Google).

#### Series

```
https://p2all.pro/find/?imdb=tt11198330&type=series&tmdb=94997&name=The%20Sandman&title=You're%20Doomed&season=1&episode=1&callback=https%3A%2F%2Fwww.google.com%2Fsearch&callback_paramater=q&target=
```

In this example:
- `imdb=tt11198330`: IMDb ID of the series "The Sandman".
- `type=series`: Type is series.
- `name=The Sandman`: Name of the series.
- `title=You're Doomed`: Title of the specific episode.
- `season=1`: Season number.
- `episode=1`: Episode number.
- `callback=https://www.google.com/search`: URL to redirect the user to Google search after choosing the torrent quality.
- `callback_paramater=q`: The torrent hash will be passed as the `q` parameter in the callback URL (i.e., it will search for the torrent hash on Google).
- `target=`: The redirection will happen in the same window (default behavior).

## Parameters Summary

- `imdb` (required): IMDb ID of the movie or series.
- `type` (required): Type of content (`movie` or `series`).
- `name` (required): Name of the movie or series.
- `callback` (required): URL to redirect to after choosing torrent quality.
- `callback_paramater` (required): Parameter name for the torrent hash in the callback URL.
- `title` (optional): Title of the specific episode (for series) or movie.
- `season` (optional): Season number (for series).
- `episode` (optional): Episode number (for series).
- `background` (optional): URL of the background image.
- `poster` (optional): URL of the poster image.
- `target` (optional): If set to `_blank`, opens redirection in a new window.

## User Responsibility

P2All Torrent Redirector is intended for legal and authorized use only. Users of this service are solely responsible for ensuring their compliance with all applicable laws and regulations, including but not limited to copyright laws, privacy laws, and terms of service of third-party sites.

### Guidelines for Users

- **Legal Use**: Users must use this service strictly for accessing and redirecting to content that they have legal rights to access or distribute. This includes ensuring that they have obtained necessary permissions or licenses for any copyrighted material.
  
- **Compliance**: Users must comply with the terms of service and usage policies of all websites and services accessed through P2All Torrent Redirector. This includes respecting any restrictions on scraping, accessing, or linking to content.

- **Personal Responsibility**: Users are personally liable for any activities conducted using this service. P2All does not endorse or promote the infringement of intellectual property rights or any illegal activities.

### Disclaimer

This project is provided on an "as-is" basis. P2All disclaims all warranties and liabilities related to the use of this service. Users assume all risks associated with their use of the service, including legal risks arising from their actions.

## Legal Advice

It is strongly recommended that users seek legal advice to understand the legal implications of using P2All Torrent Redirector in their jurisdiction. This disclaimer does not absolve users from their legal obligations or responsibilities.

---

By using P2All Torrent Redirector, you agree to abide by these guidelines and accept responsibility for your actions. If you have any questions or concerns about the legality of using this service, please consult with a qualified legal professional.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please fork the repository and submit a pull request for any features, improvements, or bug fixes.

## Contact

For any questions or support, please open an issue on GitHub or contact us directly at `support@p2all.pro`.

---
