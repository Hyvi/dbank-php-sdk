<?php

require_once('NSPClient.class.php');
$nsp = new NSPClient('xx', 'xxxxxx');
$service = $nsp->service('nsp.demo');
$ret = $service->helloworld('NSP Open');
var_dump($ret);
