<?php
include_once 'dingtalkCryptor.php';

$plainText = '';
$dingTalkCryptor = new DingtalkCrypt('123456', 'xxxxxxxxlvdhntotr3x9qhlbytb18zyz5zxxxxxxxxx', 'ding80ef5106dc236da9ffe93478753d9884');
$res = $dingTalkCryptor->DecryptMsg('351445cfea47d22988506382fd526a3538f4a5b6', '1698560230845', 'gYiKaRWB', 'tsgAzObcN9+MHlGf5BA5N7KA4h9/x3gxZTMG7HwlmIVkyzeLLelSaR+pNl0kcR037EKWC0sylx7Rr/vw+FqVrtl5ptR6jsZIhLXlCfY76p1WZuxOpHeo5toRN8ljsEMTdMsjLRcgbJfRYr8nO2E1GXCGX+3UpYYD0a3lEOX0w5dVbmfQvh9wnLpgKpD9XmX+/6B5Whe6seNpF3iAc+UAiJZA4QhGvWoZP535zTFil1CLHitn/vBmWb1vrwnUbYK+rmbGgd3whlTS4/QZVLeqt3IAMQXEW358pGh+BbRV0g9+7nU7UGi2aFXTSgtEbDsl53SwZh/Fg80/lo7OU48olcvaABT/flevvU99YL7zWSXJSwGA2MPdMcjDbc6TU98M', $plainText);

var_dump($plainText);

{
"eventId":"83546b5349fc46a29faa00e4e2ca136e",
"CorpId":"ding80ef5106dc236da9ffe93478753d9884",
"EventType":"user_leave_org",
"UserId":["021461636022-11461947"]
}