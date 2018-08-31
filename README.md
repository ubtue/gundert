# Gundert Portal
The gundert portal is meant to be a lightweight standalone php application, not using a CMS or heavyweight frameworks. So we use only few base dependencies (mainly managed by composer).

## Directory structure
|Directory|Subdirectory|Description|
|---|---|---|
|git-config|hooks|see README.md|
|lang||texts to display + translations|
|lib||PHP libraries|
|public||root directory of website, contains all files that need to be directly accessible via browser|
||cache|internal cache directory where displaytexts for JS and page cache will be stored. Cleaned via git-config/hooks.|
||css|site-specific CSS files|
||fonts|site-specific fonts|
||images|site-specific images|
||js|site-specific javascripts|
||materials|materials (e.g. letters) which need to be accessible via browser.
||vendor|external dependencies partially managed by composer, see README.md in this folder|
|tpl||HTML page templates|
||pages|HTML subpage templates|

## Installation
`git clone` this repository
run `composer install` in cloned repository
run `rm -r .git/hooks` and `ln -s git-config/hooks .git/hooks`
config your webserver and use public dir as website root
(copy inc.conf.local.tpl to inc.conf.local.php and adjust settings if needed)
Please check if the TXT files on the letters page are shown in the right encoding. If not, please check your web server settings.

## Update
`git pull`
cache will be cleaned automatically

