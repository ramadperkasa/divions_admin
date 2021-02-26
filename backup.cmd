cls
@echo off
@echo:

@echo Copyright by Puji Susanto July 2020

echo	  * Created by Puji Susanto     ___         ___     
echo	     _____                     /\  \       /\  \    
echo	    /::\  \       ___         /::\  \     /::\  \   
echo	   /:/\:\  \     /\__\       /:/\:\__\   /:/\:\  \  
echo	  /:/  \:\__\   /:/__/      /:/ /:/  /  /:/  \:\  \ 
echo	 /:/__/ \:^|__^| /::\  \     /:/_/:/  /  /:/__/ \:\__\
echo	 \:\  \ /:/  / \/\:\  \__  \:\/:/  /   \:\  \ /:/  /
echo	  \:\  /:/  /   ~~\:\/\__\  \::/__/     \:\  /:/  / 
echo	   \:\/:/  /       \::/  /   \:\  \      \:\/:/  /  
echo	    \::/  /        /:/  /     \:\__\      \::/  /   
echo	     \/__/         \/__/       \/__/       \/__/    
@echo:

echo ** To ABORT press CTRL+C
pause

set username=%USERNAME%
set param=%1
set curpath=%cd%
set year=%date:~10,4%
set month=%date:~4,2%
set day=%date:~7,2%
set hour=%time:~0,2%
set min=%time:~3,2%
set secs=%time:~6,2%
set newname=%date:~-4%%date:~7,2%_0%time:~1,1%%time:~3,2%%time:~6,2%
set backuppath=.project_backup

if not exist %backuppath% (
	mkdir %backuppath%
)

set filename="%backuppath%\%username%_%newname%.rar"
set fullfilename="%curpath%\%backuppath%\%username%_%newname%.rar"
set winrar64="%programfiles%\WinRAR\rar.exe"
set winrar32="%programfiles(x86)%\WinRAR\rar.exe"
set userar= 


@echo:
if exist %winrar64% (
	set userar=%winrar64%
	GOTO copy
) else (
	GOTO rar32
)

:rar32
if  exist %winrar32% (
	set userar=%winrar32%
	GOTO copy
) else (
	@echo: Error, Rar application not found
	GOTO finally
)

	
:copy
	
	echo Start backing up files	
	echo please wait...
	
	if "%param%"=="full" (
		%userar% a -r -x*.cmd -x*.rar -x%backuppath% %filename%
	) else (
		%userar% a -r -x*.cmd -x*.rar -x%backuppath% -xnode_modules -xvendor %filename%
	)
	
	GOTO end

:end
	@echo:
	@echo: ------------------- Backup To -------------------
	@echo: =^> %fullfilename%
	@echo: --------------------------------------------------
	@echo:
	@echo: ** Don't forget to backup every day **
	@echo: ** Coding with fast, precise and love ^^_^^
	@echo:
	@echo: ----------- Dipointer Development Team -----------
	@echo:
	echo Backup Completed.	
:finally

@echo on