import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, RefreshControl, Modal, TextInput} from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { formatCurrency, formatTime, getStatusColor } from '@/services/core/globals';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import Button from '@/components/Button';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  summaryContainer: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },

  listItem: {
    backgroundColor: '#1c1c1e',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  listItemValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D8037',
  },
  toggleButton: {
    flexDirection: 'row',
    // marginBottom: 16,
    justifyContent: 'space-evenly',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    padding: 8,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#1D8037',
    color: '#fff',
  },
  inactiveButton: {
    backgroundColor: '#1c1c1e',
    color: '#000',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginVertical: 16,
  },
  pageButton: {
    backgroundColor: '#1D8037',
    color: '#fff',
    padding: 10,
    margin: 4,
    borderRadius: 8,
  },
  inactivePageButton: {
    backgroundColor: '#333',
    color: '#999',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:10
  },
  eyeIcon: {
    marginLeft: 8,
  },
  noWithdrawalsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  accountName: {
    fontSize: 16,
    color: '#000',
    marginVertical: 8,
  },
  picker: {
    height: 50,
    backgroundColor: '#000',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#fff',  
    justifyContent: 'center',  
    paddingVertical: 10,  
  }
  

  
});

interface BankType {
  code: string;
  name: string;
}

const goBack = () => {
  router.back();
};

const TotalEarnings = () => {
  const { user } = useUser();
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0) ;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [showAmount, setShowAmount] = useState(true); 
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
    const params = useLocalSearchParams();
  const { whoInitiatedId} = params;

  useEffect(() => {
    fetchTotalEarnings();
  }, []);


  
  
  useFocusEffect(
    React.useCallback(() => {
      onRefresh(); 
      fetchTotalEarnings();
  
      return () => {
      
      };
    }, [])
  );

  const fetchTotalEarnings = async () => {
    setLoading(true);
    const userId = user?.id  || await AsyncStorage.getItem('userId'); 
    try {
      const response = await axios.get(`https://backend-server-quhu.onrender.com/withdrawal/withdrawals/${userId}`);
      const data = response?.data;
      setWithdrawals(data?.withdrawals);
      setTotalEarnings(data?.totalEarnings)
    } catch (error) {
    //   console.error('Error fetching total earnings:', error);
    }finally {
        setLoading(false);
        setIsRefreshing(false); 
      }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchTotalEarnings();
  };

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    if (statusFilter === 'all') return true;
    return withdrawal?.withdrawStatus === statusFilter;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);
  const currentWithdrawals = filteredWithdrawals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedWithdrawal(null);
  };


  const renderWithdrawalItem = ({ item }: { item: typeof withdrawals[0] }) => {
    let statusColor = '#000';
    if (item.withdrawStatus === 'approved') {
      statusColor = '#28a745';
    } else if (item.withdrawStatus === 'pending') {
      statusColor = '#ffc107';
    } else if (item.withdrawStatus === 'rejected') {
      statusColor = '#dc3545';
    }

    return (
      <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.listItem}>
        <View>
          <Text style={styles.listItemTitle}>{item.type}</Text>
          <Text style={{ color: '#666', fontSize: 12 }}>{formatTime(item.createdAt)}</Text>
        </View>
        <Text style={[styles.listItemValue, { color: statusColor }]}>
          {formatCurrency(item.amount)}
        </Text>
        <Text style={[styles.listItemValue, { color: statusColor }]}>
          {item.withdrawStatus}
        </Text>
      </View>
      </TouchableOpacity>
    );
  };
  const banks: { [key: string]: string } = {
    "100001": "FETS",
    "100002": "PAGA",
    "100004": "OPAY",
    "100013": "ACCESS MONEY",
    "100014": "FIRSTMONIE WALLET",
    "000001": "STERLING BANK",
    "100026": "CARBON",
    "100030": "ECOMOBILE",
    "100031": "FCMB MOBILE",
    "100033": "PALMPAY",
    "000036": "OPTIMUS BANK",
    "000002": "KEYSTONE BANK",
    "000003": "FIRST CITY MONUMENT BANK",
    "000004": "UNITED BANK FOR AFRICA",
    "000006": "JAIZ BANK",
    "000007": "FIDELITY BANK",
    "000008": "POLARIS BANK",
    "000009": "CITI BANK",
    "000010": "ECOBANK",
    "000011": "UNITY BANK",
    "000012": "STANBIC IBTC BANK",
    "000013": "GTBANK PLC",
    "000014": "ACCESS BANK",
    "000015": "ZENITH BANK",
    "000016": "FIRST BANK OF NIGERIA",
    "000017": "WEMA BANK",
    "000018": "UNION BANK",
    "000019": "ENTERPRISE BANK",
    "000021": "STANDARD CHARTERED BANK",
    "000022": "SUNTRUST BANK",
    "000023": "PROVIDUS BANK",
    "090267": "KUDA MICROFINANCE BANK",
    "000026": "TAJ BANK",
    "000005": "ACCESS(DIAMOND) BANK",
    "000025": "TITAN TRUST BANK",
    "000029": "LOTUS BANK",
    "000031": "PREMIUM TRUST  BANK",
    "090405": "MONIEPOINT MICROFINANCE BANK",
    "090551": "Fairmoney Microfinance Bank Ltd",
    "050006": "Branch International Finance Company Limited",

   
    }
    

  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [remark, setRemark] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankCode, setBankCode] = useState(banks[0]);

  const [isFetching, setIsFetching] = useState(false);
  const [Bank_name, setBank_name] = useState(''); 


  const [selectedBank, setSelectedBank] = useState<string>('');
  const handleValueChange = (itemValue: string) => {
    setSelectedBank(itemValue);
    setBankCode(itemValue)
  };

  useEffect(() => {
    if (selectedBank) {
      // Debounce or throttle to avoid excessive API calls
      const timeoutId = setTimeout(() => {
        fetchAccountName();
      }, 100); 

      return () => clearTimeout(timeoutId);
    }
  }, [selectedBank]);

  useEffect(() => {
     if (selectedBank && accountNumber.length === 10) {
      // Debounce or throttle to avoid excessive API calls
      const timeoutId = setTimeout(() => {
        fetchAccountName();
      }, 100); 

      return () => clearTimeout(timeoutId);
    }
  }, [selectedBank, accountNumber]);


  const fetchAccountName = async () => {
    if (!selectedBank || !accountNumber) {
      // alert('Please enter both account number and bank code.');
      return;
    }
  
    setIsFetching(true);
    try {
      const url = `https://nubapi.com/api/verify?account_number=${accountNumber}&bank_code=${selectedBank}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer waN5g6NKhm29OeFmQUAzXSToMD6BcPbXTmCzgpELec9955c8',
          'Content-Type': 'application/json',
        },
      });
      if (!response?.data) {
        throw new Error('API response is undefined.');
      }
  
      if (!response?.data?.account_name) {
        alert('No account found for the selected bank and account number.');
      } else {
        setAccountName(response?.data?.account_name);
        // Check for bank_name in response and update state if available
        if (response?.data?.Bank_name) {
          setBank_name(response?.data?.Bank_name);
        }
      }
    } catch (error) {
      alert('An error occurred while fetching account information.');
    } finally {
      setIsFetching(false);
    }
  };


const handleModalConfirm = async () => {
  setLoading(true);
  const userId = user?.id  || await AsyncStorage.getItem('userId'); 
  try {
    const response = await fetch(`https://backend-server-quhu.onrender.com/withdrawal/withdraw/${userId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId:userId,
          amount: amount,
          accountDetails:{
            accountNumber: accountNumber,
            remark: remark,
            accountName: accountName,
            bank:Bank_name
          }
         
      }),


  });
    if (response.ok) { 
      const data = await response.json();
      alert(data?.message);
      fetchTotalEarnings();
      setShowModal(false);
      setModalVisible(false);
      // Clear input fields here
      setAccountNumber('');
      setAccountName('');
      setAmount('');
      setRemark('');
      setBank_name('');
      setSelectedBank('')
    } else {
      // Handle unsuccessful response (e.g., display error message)
    }
  } catch (error) {
    // console.error('Error making withdraw:', error);
  }
  finally {
    setLoading(false);
  }
};




const [showModal, setShowModal] = useState(false);

const handleWithdraw = () => {
  setShowModal(true);
};

const handleModalCancel = () => {
  setShowModal(false); 
};


useEffect(() => {
  if (whoInitiatedId) {
    // Replace with your actual API call or data fetch logic
    fetch(`https://backend-server-quhu.onrender.com/withdrawal/withdrawal/${whoInitiatedId}`)
      .then(response => response.json())
      .then(data => setSelectedWithdrawal(data))
      .catch();
  }
}, [whoInitiatedId]);

useEffect(() => {
  if (selectedWithdrawal && whoInitiatedId === selectedWithdrawal?._id) {
    setIsModalVisible(true);
  }
}, [whoInitiatedId, selectedWithdrawal]);

  return (
    <>
       <CustomHeader title="Balance Summary" onBackPress={goBack} />
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.container}>
        {/* Summary Section */}
        <View style={styles.summaryContainer}>
          <View style={styles.listItem}>
            <View>
              <Text style={styles.listItemTitle}>Total Available Balance</Text>
              <View style={styles.amountContainer}>
                <Text style={{    fontSize: 22,
    fontWeight: '500',
    color: '#1D8037',}}>
                  {showAmount ? formatCurrency(totalEarnings) : '•••••••'}
                </Text>
                <TouchableOpacity onPress={() => setShowAmount(!showAmount)} style={styles.eyeIcon}>
                  <Ionicons
                    name={showAmount ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
      
<View >
      <Button
        text="Withdraw"
        onClick={() => setModalVisible(true)}
        variant="third" style={{ width: 120 }}
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdrawal Form</Text>

            {/* Form Fields */}
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Account Number"
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
          
          <View>

      <Picker
        selectedValue={selectedBank}
        onValueChange={handleValueChange}
        style={styles.picker}
      >
        {/* Default Option */}
        <Picker.Item label="--Select a Bank--" value="" />
        
        {/* List of Banks */}
        {Object.entries(banks).map(([code, name]) => (
          <Picker.Item key={code} label={name} value={code} />
        ))}
      </Picker>
    </View>
   
{isFetching ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {accountName && (
            <Text style={styles.accountName}>
              Account Name: {accountName}
            </Text>
          )}
        </>
      )}

<View style={styles.buttonContainer}>
  <Button
    text="Cancel"
    variant='secondary'
    onClick={() => setModalVisible(false)}
    style={{ width: 120, height: 40 }}
  />
  <Button
    text="Submit"
    onClick={handleWithdraw}
  variant='primary'
    style={{ width: 120, height: 40 }}
  />
</View>

<Modal
  visible={showModal}
  transparent={true}
  animationType="fade"
>
<View style={{    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
}}>
    <View style={styles.modalContent}>
      <Text>You are about to tranfer {formatCurrency(amount)}, to {accountNumber}, {accountName}, {Bank_name}</Text>
      <Text>The withdrawal will be rejected if bank details doesn't belong to you</Text>
      <Text>Are you sure you want to proceed with the withdrawal?</Text>
      <View style={{ flexDirection: 'row',
    justifyContent: 'space-between', marginTop:20}}>
        <Button
          text="Cancel"
          onClick={handleModalCancel}
          variant='secondary'
          style={{ width: 120, height: 40 }}
        />
        <Button
             text={loading ? "Proceeding..." : "proceed"}
          onClick={handleModalConfirm}
          variant='primary'
          disabled={loading} 
          style={{ width: 120, height: 40 }}
        />
      </View>
    </View>
  </View>
</Modal>
          </View>
        </View>
      </Modal>
    </View>

          </View>
        </View>

        {/* Toggle Section for Withdrawals */}
        <View style={styles.toggleButton}>
          {['all', 'approved', 'pending', 'rejected'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.toggleButtonText,
                status === statusFilter ? styles.activeButton : styles.inactiveButton,
              ]}
              onPress={() => setStatusFilter(status as 'all' | 'approved' | 'pending' | 'rejected')}
            >
              <Text style={{ color: status === statusFilter ? '#fff' : '#999' }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

    
<View style={styles.summaryContainer}>
  <Text style={styles.summaryText}>Withdrawals</Text>
  {filteredWithdrawals.length > 0 ? (
    <FlatList
      data={currentWithdrawals}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderWithdrawalItem}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#075E54" />} 
    />
  ) : (
    <Text style={styles.noWithdrawalsText}>No withdrawals yet</Text>
  )}
</View>


        {/* Pagination Section */}
        <View style={styles.paginationContainer}>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <TouchableOpacity
              key={page}
              style={[
                styles.pageButton,
                page === currentPage ? {} : styles.inactivePageButton,
              ]}
              onPress={() => setCurrentPage(page)}
            >
              <Text style={{ color: '#fff' }}>{page}</Text>
            </TouchableOpacity>
          ))}
        </View>


        {/* Modal for Withdrawal Details */}
        <Modal
  visible={isModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={closeModal}
>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '80%' }}>
      {selectedWithdrawal && (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Withdrawal Details</Text>
          <Text>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Type: </Text>
            <Text> {selectedWithdrawal?.type}</Text>
          </Text>
          <Text>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Amount: </Text>
            <Text> {formatCurrency(selectedWithdrawal?.amount)}</Text>
          </Text>
          <Text>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Status: </Text>
            <Text style={{ color: getStatusColor(selectedWithdrawal?.withdrawStatus), fontWeight: 'bold' }}>
              {selectedWithdrawal?.withdrawStatus}
            </Text>
          </Text>
          <Text>Date: {formatTime(selectedWithdrawal?.createdAt)}</Text>
        
         
          

          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>Account Details</Text>
            <Text>Account Number: {selectedWithdrawal?.accountDetails?.accountNumber}</Text>
            <Text>Account Name: {selectedWithdrawal?.accountDetails?.accountName}</Text>
            <Text>Bank: {selectedWithdrawal?.accountDetails?.bank}</Text>
            {selectedWithdrawal?.accountDetails?.remark ? (
  <Text style={{color: 'red', fontWeight: 'bold', marginTop:4}}>
    Remark: {selectedWithdrawal.accountDetails.remark}
  </Text>
) : null}

          </View>

          <View style={{ alignItems: 'center', marginTop: 15 }}>
            <Button
              text="Close"
              variant="secondary"
              style={{ width: 150, height: 40 }}
              onClick={closeModal}
            />
          </View>
        </>
      )}
    </View>
  </View>
</Modal>

      </View>
    </>
  );
};

export default TotalEarnings;
