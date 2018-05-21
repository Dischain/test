Public Function CreateComplexField(cell As Range, Optional l As Integer, Optional parent As ComplexField) As ComplexField
  Dim cf_obj As ComplexField
  Set cf_obj = New ComplexField
  
  cf_obj.init c:=cell, level:=l, parent:=parent
  
  Set CreateComplexField = cf_obj
End Function

Private pName As String
Private pParent As ComplexField
Private pCell As Range
Private pNumChildren As Long
Private pChildren() As ComplexField
Private pComplexityLevel As Integer
Private pPath As String

Public Sub init(c As Range, Optional level As Integer, Optional parent As ComplexField)
  pName = c.value
  pPath = c.value
  pNumChildren = 0
  pComplexityLevel = level
  
  Set pCell = c
  Set parent = parent
  
  Me.buildSubFields level:=pComplexityLevel, initial:=Me
End Sub

Public Sub addChild(child As ComplexField)
  ReDim Preserve pChildren(pNumChildren)
  Set pChildren(pNumChildren) = child
  
  pNumChildren = pNumChildren + 1
  
  child.setParent p:=Me
End Sub

Public Function valueAt(row As Long) As Range
  Dim letter As String
  letter = Split(Cells(1, pCell.Column).address, "$")(1)
  
  Set valueAt = Range(letter & row)
End Function

Public Property Get children() As Variant
    children = pChildren
End Property

Public Property Get name() As String
    name = pName
End Property

Public Property Get address() As String
    address = pCell.address
End Property

Public Property Get parent() As ComplexField
  Set parent = pParent
End Property

Public Property Get path() As String
  path = pPath
End Property

Public Sub setParent(p As ComplexField)
  Set pParent = p
  pPath = p.path & "/" & pPath
End Sub

Public Property Get numChildren() As Long
    numChildren = pNumChildren
End Property

Public Function hasChildren() As Boolean
  hasChildren = pNumChildren <> 0
End Function

Public Sub buildSubFields(level As Integer, initial As ComplexField)
  If level > 0 Then
    initial.combineSubFields init:=initial
    If initial.numChildren <> 0 Then
      For i = 0 To UBound(initial.children)
        initial.children(i).buildSubFields (level - 1), (initial.children(i))
      Next
    End If
  End If
End Sub

Public Sub combineSubFields(init As ComplexField)
  subCols = combineSubCols(init.address)
  
  For i = 0 To UBound(subCols)
    Dim subCol As ComplexField
    Set subCol = subCols(i)
    init.addChild subCol
  Next i
End Sub

　
/-----------------------------------------------------------------------------/

Public Function CreatePrimitiveRow(cl As Range, fr As Range, fcl As Integer) As PrimitiveRow
  Dim pr_obj As PrimitiveRow
  Set pr_obj = New PrimitiveRow
  
  pr_obj.init cell:=cl, fieldsRange:=fr, fieldsComplexityLevel:=(fcl)
  
  Set CreatePrimitiveRow = pr_obj
End Function

　
Private pName As String
Private pCell As Range
Private pFields() As ComplexField
Private pNumFields As Long

Public Sub init(cell As Range, fieldsRange As Range, fieldsComplexityLevel As String)
  pName = cell.value
  pNumFields = 0
  
  Set pCell = cell
  
  Call addFieldsAsRange(fieldsRange, fieldsComplexityLevel)
End Sub

Public Sub addFieldsAsRange(fieldsRange As Range, fieldsComplexityLevel As String)
  For Each cell In fieldsRange
    If cell.value <> "" Then
      Dim cf As ComplexField
      Set cf = ComplexFieldFactory.CreateComplexField(Range(cell.address), (fieldsComplexityLevel))
            
      ReDim Preserve pFields(pNumFields)
      Set pFields(pNumFields) = cf
      pNumFields = pNumFields + 1
    End If
  Next
End Sub

Public Sub addFields(fields() As ComplexField)
  For Each field In fields
    pNumFields = pNumFields + 1
    ReDim Preserve pFields(pNumFields)
    Set pFields(pNumFields) = field
  Next
End Sub

' In case of match, should return non-empty string
' Otherwise, returns ""
Public Function getVal(fieldName As String) As String
  For i = 1 To pNumFields
    If pFields(i).name = fieldName Then
      getVal = pFields(i).valueAt(pCell.row)
      Exit For
    Else
      getVal = ""
    End If
  Next
End Function

Public Function getValByPath(p As String) As String
  Debug.Print (UBound(pFields))
  For i = 0 To pNumFields - 1
    Debug.Print (i & ": " & pFields(i).path)
    If pFields(i).path = p Then
      getValByPath = pFields(i).valueAt(pCell.row)
      Exit For
    Else
      getValByPath = ""
    End If
  Next
End Function

　
/-----------------------------------------------------------------------------/

　
Private Sub test1()
  Dim t As Column
  Set t = ColumnFactory.CreateColumn("test", "C", 17, 230)
  
  prompt = ""
  For Each iCell In t.rows
    If iCell.value <> "" Then
      prompt = prompt & iCell.value & " " & iCell.address & Chr(13)
    End If
  Next

  Debug.Print (prompt)
End Sub

Private Sub ComplexFieldTest()
  Dim field1 As ComplexField
  Set field1 = ComplexFieldFactory.CreateComplexField(Range("c6"))
  Dim field2 As ComplexField
  Set field2 = ComplexFieldFactory.CreateComplexField(Range("c8"))
  field1.addChild child:=field2
  Debug.Print (field1.valueAt(100))
  Debug.Print (field1.hasChildren)
  Debug.Print (field2.parent.name)
End Sub

Private Sub primitiveRowTest()
  Dim r1 As PrimitiveRow
  Set r1 = PrimitiveRowFactory.CreatePrimitiveRow(Range("c20"), Range("r10:ab10"), 1)
  r1.addFieldsAsRange fieldsRange:=Range("AC8:CL8"), fieldsComplexityLevel:=(3)
  Debug.Print ("Íàéäåíî1: " & r1.getVal("ôåâðàëü"))
  Debug.Print ("Íàéäåíî2: " & r1.getValByPath("ôåâðàëü/Ôåäåðàëüíûé áþäæåò/ïëàí/4"))
  Debug.Print ("Íàéäåíî3: " & r1.getValByPath("ôåâðàëü"))
End Sub

Private Sub combineSubColsTest()
  Dim field As ComplexField
  Set field = ComplexFieldFactory.CreateComplexField(Range("AC8"), 3)

  Debug.Print ("-----")
  Debug.Print ("name: " & field.name)
  Debug.Print ("field.numChildren: " & field.numChildren)
  'field.buildSubFields level:=3, initial:=field
  Dim l1 As ComplexField
  Set l1 = field.children(1)
  Dim l2 As ComplexField
  Set l2 = l1.children(0)
  Debug.Print (l2.children(0).parent.parent.name)
  Debug.Print (l2.children(0).path)
End Sub

　
/-----------------------------------------------------------------------------/
