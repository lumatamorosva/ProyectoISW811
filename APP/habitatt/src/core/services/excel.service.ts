import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExcelService {
    async generateExcelReport(data: any[], fileName: string): Promise<void> {
    // 1. Crea el libro y la hoja
    const workbook = new ExcelJS.Workbook();
    const today = new Date().toISOString().split('T')[0];
    //Se exporta el reporte con la fecha de hoy en el nombre del archivo
    const worksheet = workbook.addWorksheet(`Citas ${today}` );
    // 2. Define columnas y encabezados
    worksheet.columns = [
        { header: 'Id', key: 'id', width: 5 },
        { header: 'Profesional', key: 'nombreProfesional', width: 20 },
        { header: 'Servicio', key: 'nombreServicio', width: 30 },
        { header: 'Cliente', key: 'nombreCliente', width: 20 },
        { header: 'Modalidad', key: 'modalidad', width: 10 },
        { header: 'Fecha', key: 'fecha', width: 12},
        { header: 'Hora', key: 'hora', width: 10 },
        { header: 'Descripción', key: 'descripcion', width: 40 },
        { header: 'Monto', key: 'monto', width: 12}
    ];
    const montoColumn = worksheet.getColumn('monto');
    montoColumn.numFmt = '₡#,##0.00';
    // 3. Agrega filas
    worksheet.addRows(data);
    // 4. Estilizar
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '001F3F' }};
    // 5.Genera el Buffer en memoria y descargar en el navegador
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    saveAs(blob, `${fileName}.xlsx`);
    }
}