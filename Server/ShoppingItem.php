<?php

class ItemList
{
	public $items;
	function __construct()
	{
		$this->items = array();
		
	}
	function Add($article_id, $article, $details, $baseAmount, $record)
	{
		$key = $article_id;
		$record->amountBase = $baseAmount;
		if(!array_key_exists($key, $this->items))
		{
			$item = new ShoppingItem($article, $details);
			$item->baseAmount = $baseAmount;
			$this->items[$key] = $item;
		}
		$this->items[$key]->records[]= $record;
	}
	
	function JSON()
	{
		$toReturn = "[";
		foreach($this->items as $item)
		{
			$toReturn.=$item->JSON(). ", ";
		}
		
		return $toReturn.="]";
	}}

class ShoppingItem
{
    public $article = '';
	public $details = '';
	public $priceMin = '';
	public $priceMax = '';
	public $baseAmount = '';
	public $records = array();
	
	function __construct($art_in, $det_in)
	{
		$this->article =	$art_in;
		$this->details = $det_in;
	}
	
	function JSON()
	{
		$toReturn = "{ articlename: \"".$this->article."\", 
					articledetails: \"".$this->details."\",
					records: [";
		foreach($this->records as $record)
		{
			$toReturn.=$record->JSON(). ", ";
		}
		$toReturn.="]}";		
		return $toReturn;		
	}
}

class ItemRecord
{
	public $store = '';
	public $date = '';
	public $comment = '';
	public $price = '';
	public $priceBase = '';
	public $amount = '';
	public $amountBase = '';

	function JSON()
	{
		return "{storename: \"".$this->store."\", 
				baseprice: \"".$this->priceBase."\", 
				baseamount: \"".$this->amountBase."\", 
				dateoffer: \"".$this->date."\", 
				priceoffer: \"".$this->price."\", 
				amountoffer: \"".$this->amount."\", 
				comment: \"".$this->comment."\" }";
	}
}

?>
