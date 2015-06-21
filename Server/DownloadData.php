<?php

//header('Content-Type: text/html; charset=utf-8'); 

require_once 'php-spreadsheetreader/SpreadsheetReaderFactory.php';
require_once 'ShoppingItem.php';

//$spreadsheetsFilePath = 'Kilopreisecopy.ods'; //or test.xls, test.csv, etc.
$spreadsheetsFilePath = 'D:\Referenz\Haushalt\Kochen und Lebensmittel\Kilopreise.ods';

if(!file_exists($spreadsheetsFilePath))
{
	$spreadsheetsFilePath="Kilopreise.ods";
}
$reader = SpreadsheetReaderFactory::reader($spreadsheetsFilePath);

$sheets = $reader->read($spreadsheetsFilePath);
$sheetsXml = $reader->read($spreadsheetsFilePath, SpreadsheetReader::READ_XMLSTRING);
@$xml =  new SimpleXMLElement($sheetsXml);

$list = new ItemList();
$i=0;

 foreach($xml->sheet as $sheet)
 {
	 
	 //echo "$sheet->name ($i)";
	 // if($sheet->name == "Gemüse" 
	 // || $sheet->name == "Konserven"
	 // || $sheet->name == "Backen")
	 {
		 processVegetables($list, $sheets, $i, count($sheet->row));
		

	 }
	 
	 $i++;
	// echo "<table>";
	// foreach($sheet->row as $row)
	// {
		// echo "<tr>";
		// foreach($row->col as $col)
		// {
			// echo "<td>$col </td>";
		// }
		// echo "</tr>";
	// }
	// echo "<table>";
 }
//var_dump($list);

function processVegetables($list, $sheets, $i, $numRows)
{
	$indexDate = 0;
	$indexShop = 1;
	$indexArticle = 2;
	$indexKind = 3;
	$indexSource = 4;
	$indexAmount = 5;
	$indexPrice = 6;
	$indexBasePrice = 7;
	$indexComment = 8;
	
	for($j=1;$j<$numRows;$j++)
	{
		if(isset($sheets[$i][$j][$indexShop])
			&& $sheets[$i][$j][$indexShop] != "")
		{
			$comment = "";
			if(isset($sheets[$i][$j][$indexKind]) && strlen($sheets[$i][$j][$indexKind]) > 0)
			{
				$comment.= $sheets[$i][$j][$indexKind];
			}
			if(isset($sheets[$i][$j][$indexComment]))
			{
				if(strlen($comment)>0)
				{
					$comment.=", ";
				}
				$comment.= $sheets[$i][$j][$indexComment];
			}
			
			$record = new ItemRecord();
			$record->store = $sheets[$i][$j][$indexShop];
			$record->date = $sheets[$i][$j][$indexDate];
			$record->comment = $comment;
			$record->price = $sheets[$i][$j][$indexPrice];
			
			if(!isset($sheets[$i][$j][$indexBasePrice]))
			{
				echo "Basispreis fehlt in Zeile ". ($j+1) . " von Sheet " . ($i+1);
			}
			$record->priceBase = $sheets[$i][$j][$indexBasePrice];
			$record->amount = $sheets[$i][$j][$indexAmount];
			
			$articleName = $sheets[$i][$j][$indexArticle];
			$articleDetails = $sheets[$i][$j][$indexSource ];
			$index = $articleName.$articleDetails;
	
			$list->Add($index, $articleName, $articleDetails, $sheets[$i][0][$indexBasePrice], $record);
		}
	}	
}

//have them here in order to see problems before output
header("Content-type: text/calendar");
header('Content-disposition: attachment;filename="data.js"'); 
echo "var initialData = ".$list->JSON();
//echo $sheets["Gemüse"][448][3];

	
	