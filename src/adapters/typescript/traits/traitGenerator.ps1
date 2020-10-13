# Powershell
$newline = "`n"

# Regex
$optional = '(?:{0})?'
$leastWhitespace = '[\s]*?'
$leastAll = '[\s\S]*?'
$capture = '(?<{0}>{1})'


# declarations
$declarationStart = '(?:=|\{)'
$declarationEnd = '(?:export|type|const|let|var|class|function|namespace|\}|;|//|/\*)'
$declarationBodyGroupName = 'declarationBody'
$declarationBody = "$($declarationStart)$($capture -f $declarationBodyGroupName, $leastAll)$($declarationEnd)"

# types
$typeDeclarationStart = "$($optional -f "export$($leastWhitespace)")type"
$typeNameGroupName = 'typeName'
$typeName =  $capture -f $typeNameGroupName, '[^<=\s]+'
$genericListGroupName = 'genericList'
$genericList = "<$($capture -f $genericListGroupName, '[^>]+')>"


$internalTypeSuffix = 'Internal'
$typeDeclaration = 
  $typeDeclarationStart,
  $typeName,
  ($optional -f $genericList),
  $declarationBody -join $leastWhitespace


# Powershell
function Test-IsRefType($any)
{
    return ($null -ne $any -and -not $any.GetType().IsValueType)
}

function Get-PropertyNames($Of)
{
  if (Test-IsRefType $Of)
  {
    Get-Member -InputObject $Of -MemberType NoteProperty |
      Select-Object -ExpandProperty Name
  }
  else 
  {
    @()
  }
}

function Copy-Properties ($From, $To)
{
  Get-PropertyNames $From |
      ForEach-Object {
        if ($null -eq $To.$($_))
        {
          $To | Add-Member -MemberType NoteProperty -Name $_ -Value $From.$($_)
        }
        else
        {
          Copy-Properties $From.$($_) $To.$($_) 
        }
      }
}

function New-DeepObject
{
  begin { $object = [PSCustomObject]@{} }

  process {
    if ($null -eq (Get-PropertyNames $_)) { return $_ }

    $toAssign = $_
    Get-PropertyNames $toAssign |
      ForEach-Object {
        $key, $rest = $_ -split '\.', 2
    
        $merge = [PSCustomObject]@{}
        if ($null -eq $rest) { $merge = [PSCustomObject]@{ $key = $toAssign.$($key) } }
        else { $merge = [PSCustomObject]@{ $rest = $toAssign.$($key) | New-DeepObject } }
    
        Copy-Properties $merge $object
      }
  }

  end { $object }
}
  

# TypeScript
function Get-TypeScriptFiles {
  Get-ChildItem -Path './' -Recurse -Include '*.ts'  | 
    ForEach-Object { 
      @{ 
        path = $_.FullName | Resolve-Path -Relative;
        content = Get-Content $_.FullName | Out-String
      }
    }
}

function Get-Types {
  Get-TypeScriptFiles  | 
    Where-Object { ($_.content | Select-String $typeDeclaration).Count -ne 0 } |
      ForEach-Object { 
        @{ 
          path = $_.path;
          types = $_.content |
            Select-String $typeDeclaration -AllMatches | 
              Select-Object -ExpandProperty Matches |
                ForEach-Object {
                  $typeName = $_.Groups[$typeNameGroupName].Value
                  If ('' -eq $typeName) { return }

                  $typeBaseName = $typeName.TrimEnd($internalTypeSuffix)
                  if ($typeName -eq $typeBaseName)
                  {
                    $typePath = $typeName
                  }
                  else
                  {
                    $typePath = "$($typeName).$($typeName.TrimStart($typeBaseName))"
                  }
    
                  [PSCustomObject]@{
                    $typePath = @{
                      genericList = $_.Groups[$genericListGroupName].Value;
                      body = $_.Groups[$declarationBodyGroupName].Value;
                    };
                  }
                } | New-DeepObject
        }
      } 
}


Get-Types | 
  ConvertTo-Json -Depth 5 | 
    Out-File -FilePath './traits.json'
