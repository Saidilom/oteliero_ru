'use client';

import React from "react";
import bookingService from "@/services/myRoom/booking/bookingService";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { bookings } from "@/typings";
import BookingStatus from "@/components/Booking/BookingStatus/BookingStatus";
import { formatShortDate } from "@/utils/utils";
import BookingGuests from "@/components/Booking/BookingGuests/BookingGuests";
import BookingContactDetailsCard from "@/components/Booking/BookingContactDetailsCard/BookingContactDetailsCard";
import BookingDetailsCard from "@/components/Booking/BookingDetailsCard/BookingDetailsCard";
import BookingExtraDetailsList from "@/components/Booking/BookingExtraDetailsList/BookingExtraDetailsList";
import "./booking.css";

export default function Booking({
  params,
}: {
  params: {
    id: string;
  };
}) {
	const [booking, setBooking] = React.useState<bookings.IBookingData | null>(null);
	const [loaded, setLoaded] = React.useState<boolean>(false);

	React.useEffect(() => {
		let mounted = true;
		bookingService
			.getBookingDataById(params.id)
			.then((res) => {
				const data = (res?.data && typeof res.data === 'object' && 'data' in res.data) ? (res.data as any).data : res.data;
				if (mounted) setBooking(data as bookings.IBookingData);
			})
			.catch(() => {
				if (mounted) setBooking(null);
			})
			.finally(() => {
				if (mounted) setLoaded(true);
			});
		return () => {
			mounted = false;
		};
	}, [params.id]);

	if (!loaded) return null;
	if (!booking) return null;

  return (
    <div className="bookingData">
      <div className="bookingDetails">
        <div className="checkInOutTypeDiv">
          <div className="type">
            <div>
              <LoginOutlined />
              <span>Check-In</span>
            </div>
            <div>{formatShortDate(new Date(booking.checkIn))}</div>
          </div>

          <div className="type">
            <div>
              <LogoutOutlined />
              <span>Check-Out</span>
            </div>
            <div>{formatShortDate(new Date(booking.checkOut))}</div>
          </div>
          <BookingGuests guests={booking.guests} />
        </div>

        <div className="statusAndContactDetaisDiv">
          <BookingContactDetailsCard contactDetails={booking.contactDetails} />
          <div>
            <div>Status</div>
            <div>
              <BookingStatus status={booking.status} />
            </div>
          </div>
        </div>

        <BookingDetailsCard booking={booking} />

        <BookingExtraDetailsList booking={booking} />
      </div>
    </div>
  );
}
