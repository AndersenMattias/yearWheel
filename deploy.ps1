param ([Parameter(Mandatory)]$Url)

function DeploySPFxToAppCatalog($appCatalogUrl) {

   try {

      # From: https://github.com/giuleon/AutomatedDeploymentForSPFx

      $currentLocation = Get-Location | Select-Object -ExpandProperty Path

      Write-Host ($currentLocation + "\config\package-solution.json")

      $packageConfig = Get-Content -Raw -Path ($currentLocation + "\config\package-solution.json") | ConvertFrom-Json

      $packagePath = Join-Path ($currentLocation + "\sharepoint\") $packageConfig.paths.zippedPackage -Resolve

      Write-Host "packagePath: $packagePath"

      $skipFeatureDeployment = $packageConfig.solution.skipFeatureDeployment

      Connect-PnPOnline -Url $appCatalogUrl -Interactive

      Write-Host "Uploading the sppkg on the AppCatalog ($($appCatalogUrl))" -ForegroundColor Yellow



      # Adding and publishing the App package

      If ($skipFeatureDeployment -ne $true) {

         Add-PnPApp -Path $packagePath -Publish -Overwrite

      }

      Else {

         Add-PnPApp -Path $packagePath -SkipFeatureDeployment -Publish -Overwrite

      }

      Write-Host "****************************************************************************************" -ForegroundColor Green

      Write-Host "The SPFx solution has been succesfully uploaded and published to the AppCatalog at $((Get-Date).ToShortTimeString())" -ForegroundColor Green

      Write-Host "****************************************************************************************" -ForegroundColor Green

   }

   catch {

      Write-Host "Error when publishing app to AppCatalog" -ForegroundColor Red

   }

}

Connect-PnPOnline -Url $Url -Interactive

$appCatalogUrl = Get-PnPTenantAppCatalogUrl

gulp clean

gulp bundle --ship

gulp package-solution --ship

DeploySPFxToAppCatalog -appCatalogUrl $appCatalogUrl