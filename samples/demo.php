<?php

   require_once dirname(__FILE__).'/../NSPClient.class.php';
   // NSPClient 须两个参数




   // 1) 应用级别的调用： 一个为app id, 第二个为app secret 
      $nsp = new NSPClient('4', 'test045a555688cec4b1accf8086b48e');
      // 调用服务(=com.dbank.link)的其中一个get方法，获取该id(=c0j9ycj3la)对应的文件信息
      $linkService = $nsp->service('com.dbank.link');
      $ret = $linkService->get('c0j9ycj3la');
      var_dump($ret);

   // 2) 用户级别的调用： 一个为session,第二个参数为secret
      // 提示：web登录之后，生成的session和secret存在cookie中
      $nsp = new NSPClient('-uTP5tKuuL1WWuCIrwmuaUGO8YTJ3.zoL6m7j.DTU7ycY6G1', '3c4ae3422ab00e531b055cb0894990cf');
      //调用服务(=nsp.user)中的getInfo方法，获取用户的信息
      $userService = $nsp->service('nsp.user');
      $ret = $userService->getInfo(array("user.uid"));
      var_dump($ret);


   // 3) 应用级别和用户级别的交叉调用：(ERROR)

      // 错误调用用户级别接口
      $nsp = new NSPClient('4', 'test045a555688cec4b1accf8086b48e'); 
      //调用服务(=nsp.user)中的getInfo方法，获取用户的信息
      $userService = $nsp->service('nsp.user'); //error 
      try {
         $ret = $userService->getInfo(array("user.uid"));
         var_dump($ret);
      }catch (Exception $e){
         echo "Caught exception: ".$e->getMessage()."\n";
      }

      // 错误地调用了应用级别的接口
      $nsp = new NSPClient('-uTP5tKuuL1WWuCIrwmuaUGO8YTJ3.zoL6m7j.DTU7ycY6G1', '3c4ae3422ab00e531b055cb0894990cf');
      // 调用服务(=com.dbank.link)的其中一个get方法，获取该id(=c0j9ycj3la)对应的文件信息
      $linkService = $nsp->service('com.dbank.link'); //error
      try { 
         $ret = $linkService->get('c0j9ycj3la');
         var_dump($ret);
      }catch (Exception $e){
         echo "Caught exception: ".$e->getMessage()."\n";
      }


