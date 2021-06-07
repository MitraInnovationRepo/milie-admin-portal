export class PendingPayment {
    shopId: string;
    shopCode: string;
    shopName: string;
    mobileNumber: string;
    orderCount: number;
    orderAmount: number;
    commissionRate: number;
    commissionAmount: number;
    totalPayable: number;
    startDate: string;
    endDate: string;
    paymentStatus: number;
}