<?php

$file = file_get_contents('http://www.cbr.ru/scripts/XML_daily.asp');

$currency = new SimpleXMLElement($file);

$dolarUSA = 10;

$nameCurrency = $currency->Valute[$dolarUSA]->Name;
$valueCurrency = $currency->Valute[$dolarUSA]->Value;
?>
