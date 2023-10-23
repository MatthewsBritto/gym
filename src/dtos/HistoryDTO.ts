type HistoryDTO = {
  id: string;
  name: string;
  group: string;
  hour: string;
  create_at: string;
}

type HistoryByDayDTO = {
  title: string;
  data: HistoryDTO[];
}

export { HistoryByDayDTO, HistoryDTO };