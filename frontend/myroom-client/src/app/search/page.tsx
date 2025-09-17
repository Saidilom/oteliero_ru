'use client';

import React from "react";
import NavPagination from "@/components/Search/SearchNavPagination/SearchNavPagination";
import SearchRoomItem from "@/components/Search/SearchRoomItem/SearchRoomItem";
import roomService from "@/services/myRoom/rooms/roomService";
import { rooms as roomsTypes } from "@/typings";
import { useSearchParams } from "next/navigation";

interface IQueryData {
  rooms: roomsTypes.IRoomData[];
  totalRecods: number;
  totalPages: number;
  currentPage: number;
}

export default function Search() {
  const searchParams = useSearchParams();
  const [data, setData] = React.useState<IQueryData | null>(null);

  React.useEffect(() => {
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      paramsObj[k] = v;
    });
    let mounted = true;
    roomService
      .getRooms(paramsObj as any)
      .then((res) => {
        if (!mounted) return;
        setData(res.data as IQueryData);
      })
      .catch(() => {
        if (!mounted) return;
        setData({ rooms: [], totalRecods: 0, totalPages: 0, currentPage: 1 });
      });
    return () => {
      mounted = false;
    };
  }, [searchParams]);

  if (!data) return null;

  return (
    <>
      <div className="items">
        {data.rooms.map((room) => (
          <SearchRoomItem key={room.id} room={room} />
        ))}
      </div>
      {data.totalPages > 0 && (
        <NavPagination
          totalRecods={data.totalRecods}
          totalPages={data.totalPages}
          currentPage={data.currentPage}
        />
      )}
    </>
  );
}
